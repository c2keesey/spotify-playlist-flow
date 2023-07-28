import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel, PlaylistSchemaI } from "../database.js";

class SyncPlaylistsHandler extends SpotifyBaseHandler {
  private async getPlaylistTrackURIs(playlistID: string): Promise<string[]> {
    const fields = "items(track(uri)),next";
    const limit = 50;
    let offset = 0;
    let hasNextPage = true;
    let tracks: string[] = [];
    while (hasNextPage) {
      try {
        const trackResponse = await this.spotifyApi.getPlaylistTracks(
          playlistID,
          {
            offset: offset,
            limit: limit,
            fields: fields,
          }
        );
        let rawTracks: (string | undefined)[] = trackResponse.body.items.map(
          (item) => {
            return item.track?.uri;
          }
        );
        const filteredTracks = rawTracks.filter(
          (track): track is string => track !== undefined
        );
        tracks.push(...filteredTracks);
        hasNextPage = trackResponse.body.next !== null;
        offset += limit;
      } catch (err) {
        console.error(`Error getting tracks for playlist: ${playlistID}`, err);
        break;
      }
    }
    return tracks;
  }

  private async updatePlaylist(playlist: PlaylistSchemaI): Promise<void> {
    let tracks: string[] = await this.getPlaylistTrackURIs(playlist.id);
    for (const downstreamPlaylist of playlist.downstream) {
      const downstreamTracks: string[] = await this.getPlaylistTrackURIs(
        downstreamPlaylist
      );
      let filteredTracks = tracks.filter(
        (track) => !downstreamTracks.includes(track)
      );
      let tracksLeft = filteredTracks.length;
      while (tracksLeft > 0) {
        try {
          await this.spotifyApi.addTracksToPlaylist(
            downstreamPlaylist,
            filteredTracks.slice(
              filteredTracks.length - tracksLeft,
              tracksLeft > 100
                ? filteredTracks.length - tracksLeft + 100
                : undefined
            )
          );
          tracksLeft -= 100;
        } catch (err) {
          console.error(
            `Unable to add tracks to playlist: ${downstreamPlaylist}`,
            err
          );
          break;
        }
      }
    }
  }

  async handle(event: HandlerEvent, context: HandlerContext): Promise<any> {
    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

    await this.initializeMongoDB();

    const { userID, accessToken } = JSON.parse(event.body || "{}");

    this.spotifyApi.setAccessToken(accessToken);

    if (!userID) {
      return {
        statusCode: 400,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Owner parameter is required." }),
      };
    }

    try {
      const playlists: PlaylistSchemaI[] = await PlaylistModel.find({
        owner: userID,
        changed: true,
      });
      let nextUpdateBatch = playlists.filter(
        (playlist) =>
          playlist.upstream.length === 0 && playlist.downstream.length > 0
      );
      while (nextUpdateBatch.length != 0) {
        for (const playlist of nextUpdateBatch) {
          try {
            await this.updatePlaylist(playlist);
          } catch (error) {
            console.error(`Error updating playlist: ${playlist.id}`, error);
          }
        }

        let nextUpdateBatchTemp: PlaylistSchemaI[] = [];
        for (const playlist of nextUpdateBatch) {
          nextUpdateBatchTemp.push(
            ...playlists.filter((nextPlaylist) =>
              nextPlaylist.upstream.includes(playlist.id)
            )
          );
        }
        const batchSet = new Set(nextUpdateBatchTemp);
        nextUpdateBatch = Array.from(batchSet);
      }

      return {
        statusCode: 200,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Success syncing playlists" }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Error syncing playlists" }),
      };
    }
  }
}

const handler: Handler = async (event, context) => {
  const syncPlaylistsHandler = new SyncPlaylistsHandler();
  return await syncPlaylistsHandler.handle(event, context);
};

export { handler };
