import express from "express";
import { UserModel, PlaylistModel, PlaylistSchemaI } from "./database.js";

const dataRoutes = express.Router();

const createOrUpdatePlaylist = async (id: string, userID: string) => {
  try {
    const filter = { id: id };
    const update = { id: id, owner: userID };
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
    req.body.userPlaylistIDs.map((id: string) =>
      createOrUpdatePlaylist(id, req.body.userID)
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

export default dataRoutes;
