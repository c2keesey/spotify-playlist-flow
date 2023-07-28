import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel } from "../database.js";

const createOrUpdatePlaylist = async (
  id: string,
  userID: string,
  name: string
) => {
  try {
    const filter = { id: id };
    const update = { id: id, owner: userID, name: name };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const result = await PlaylistModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return result;
  } catch (error) {
    console.error("Error occurred during playlist creation or update:", error);
  }
};

class SetPlaylistsHandler extends SpotifyBaseHandler {
  async handle(event: HandlerEvent, context: HandlerContext): Promise<any> {
    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

    await this.initializeMongoDB();

    try {
      const body = JSON.parse(event.body || "{}");
      const playlistIDs = body.userPlaylistIDs.map(
        (playlist: { id: string; name: string }) => playlist.id
      );

      // Create or update playlists
      await Promise.all(
        body.userPlaylistIDs.map((playlist: { id: string; name: string }) =>
          createOrUpdatePlaylist(playlist.id, body.userID, playlist.name)
        )
      );

      // Remove playlists not in body
      await PlaylistModel.deleteMany({
        owner: body.userID,
        id: { $nin: playlistIDs },
      });

      return {
        statusCode: 200,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Playlists updated successfully" }),
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Error updating playlists" }),
      };
    }
  }
}

const handler: Handler = async (event, context) => {
  const setPlaylistsHandler = new SetPlaylistsHandler();
  return await setPlaylistsHandler.handle(event, context);
};
export { handler };
