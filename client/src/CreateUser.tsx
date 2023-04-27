import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";

const CreateUser = () => {
  const { userPlaylists, userID } = useSpotify();
  let success: boolean = false;

  const userPlaylistIDs = userPlaylists.map(
    (playlist: SpotifyApi.PlaylistObjectSimplified) => {
      return playlist.id;
    }
  );

  axios
    .post("http://localhost:3001/data/user", {
      userID,
      userPlaylistIDs,
    })
    .then((res) => {
      success = true;
    })
    .catch((err) => {
      console.log(err);
    });
};

export default CreateUser;
