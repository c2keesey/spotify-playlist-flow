import express from "express";
import { UserModel, PlaylistModel, PlaylistSchemaI } from "./database.js";
import mongoose from "mongoose";

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

dataRoutes.post("/user", (req, res) => {
  UserModel.find({ userID: req.body.userID })
    .then((user) => {
      console.log(user)
      if (user.length === 0) {
        console.log("creating user");
        const emptyPlaylists: mongoose.Model<PlaylistSchemaI>[] = [];
        Promise.all(
          req.body.userPlaylistIDs.map((id: string) =>
            createOrUpdatePlaylist(id, req.body.userID)
          )
        )
          .then((playlists) => {
            playlists.forEach((playlist) => {
              emptyPlaylists.push(playlist);
            });
            UserModel.create({
              userID: req.body.userID,
              playlists: emptyPlaylists,
            })
              .then((createdUser) => {
                res.send(createdUser);
              })
              .catch((createUserErr) => {
                console.error(createUserErr);
                res.status(500).send({ message: "Error creating user" });
              });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Error creating playlists" });
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

export default dataRoutes;
