import express from "express";
import { UserModel, PlaylistModel, PlaylistSchemaI } from "./database.js";
import { spotifyApi } from "./server.js";

const dataRoutes = express.Router();

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

dataRoutes.post("/setPlaylists", (req, res) => {
  Promise.all(
    req.body.userPlaylistIDs.map((playlist: { id: string; name: string }) =>
      createOrUpdatePlaylist(playlist.id, req.body.userID, playlist.name)
    )
  )
    .then((res) => {
      console.log("update playlist success");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error creating playlists" });
    });
});

dataRoutes.post("/createUser", (req, res) => {
  UserModel.find({ userID: req.body.userID })
    .then((user) => {
      if (user.length === 0) {
        console.log("creating user");
        UserModel.create({
          userID: req.body.userID,
        })
          .then((createdUser) => {
            res.send(createdUser);
          })
          .catch((createUserErr) => {
            console.error(createUserErr);
            res.status(500).send({ message: "Error creating user" });
          });
      } else {
        res.send(user[0].userID);
      }
    })
    .catch((findUserErr) => {
      console.error(findUserErr);
      res.status(500).send({ message: "Error finding user" });
    });
});

dataRoutes.get("/getFlow", (req, res) => {
  PlaylistModel.find({ id: req.query.id, owner: req.query.owner }).then(
    (flow) => {
      res.send(flow);
    }
  );
});

const getPlaylistTrackURIs = async (playlistID: string) => {
  const fields = "items(track(uri)),next";
  const limit = 50;
  let offset = 0;
  let hasNextPage = true;
  let tracks: string[] = [];
  while (hasNextPage) {
    try {
      const trackResponse = await spotifyApi.getPlaylistTracks(playlistID, {
        offset: offset,
        limit: limit,
        fields: fields,
      });
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
};

const updatePlaylist = async (playlist: PlaylistSchemaI) => {
  let tracks: string[] = await getPlaylistTrackURIs(playlist.id);

  for (const downstreamPlaylist of playlist.downstream) {
    const downstreamTracks: string[] = await getPlaylistTrackURIs(
      downstreamPlaylist
    );
    tracks = tracks.filter((track) => !downstreamTracks.includes(track));
    let tracksLeft = tracks.length;
    while (tracksLeft > 0) {
      try {
        await spotifyApi.addTracksToPlaylist(
          downstreamPlaylist,
          tracks.slice(
            tracks.length - tracksLeft,
            tracksLeft > 100 ? tracks.length - tracksLeft + 100 : undefined
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

  console.log(`Success updating downstream playlists of ${playlist.name}`);
};

dataRoutes.get("/syncPlaylists", (req, res) => {
  const { owner } = req.query;

  PlaylistModel.find({ owner: owner })
    .then(async (playlists: PlaylistSchemaI[]) => {
      let nextUpdateBatch = playlists.filter(
        (playlist) =>
          playlist.upstream.length === 0 && playlist.downstream.length > 0
      );
      while (nextUpdateBatch.length != 0) {
        for (const playlist of nextUpdateBatch) {
          try {
            await updatePlaylist(playlist);
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
    })
    .then(() => {
      res.status(200).send({ message: "Success syncing playlists" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: "Error syncing playlists" });
    });
});

function hasCycle(
  playlists: Record<string, string[]>,
  currentPlaylist: string,
  targetPlaylist: string
) {
  const visited = new Set<string>();

  function dfs(node: string) {
    if (visited.has(node)) {
      return false;
    }
    visited.add(node);
    if (node === currentPlaylist) {
      return true;
    }
    for (const play of playlists[node]) {
      if (dfs(play)) {
        return true;
      }
    }
    return false;
  }
  return dfs(targetPlaylist);
}

dataRoutes.post("/addFlow", async (req, res) => {
  interface RequestBody {
    userID: string;
    currentPlaylist: string;
    targetPlaylist: string;
    isUpstream: boolean;
  }
  const { userID, currentPlaylist, targetPlaylist, isUpstream }: RequestBody =
    req.body;
  // Check for cycles
  try {
    const allPlaylists: Record<string, string[]> = {};
    const userPlaylists = await PlaylistModel.find({ owner: userID });
    userPlaylists.map((playlist) => {
      allPlaylists[playlist.id] = playlist.downstream;
    });
    if (
      hasCycle(
        allPlaylists,
        !isUpstream ? currentPlaylist : targetPlaylist,
        !isUpstream ? targetPlaylist : currentPlaylist
      )
    ) {
      res.sendStatus(400);
      return;
    }
  } catch (err) {
    console.error("Error occurred during adding flow:", err);
    res.status(500).send({ message: "Error adding flow" });
  }

  try {
    const flowType = isUpstream ? "upstream" : "downstream";
    const filter = { id: currentPlaylist, owner: userID };

    const update = { $addToSet: { [flowType]: targetPlaylist } };

    const updateCurrentResult = await PlaylistModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );
    const targetFilter = { id: targetPlaylist, owner: userID };
    const targetFlowType = !isUpstream ? "upstream" : "downstream";
    const targetUpdate = { $addToSet: { [targetFlowType]: currentPlaylist } };

    const updateTargetResult = await PlaylistModel.findOneAndUpdate(
      targetFilter,
      targetUpdate,
      {
        new: true,
      }
    );

    res.send({ current: updateCurrentResult, target: updateTargetResult });
  } catch (error) {
    console.error("Error occurred during adding flow:", error);
    res.status(500).send({ message: "Error adding flow" });
  }
});

export default dataRoutes;
