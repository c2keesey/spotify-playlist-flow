import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";

const useCreateUser = () => {
  const { userPlaylists, userID } = useSpotify();

  useEffect(() => {
    if (userID) {
      axios.post("http://localhost:3001/data/createUser", {
        userID,
      });
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      const userPlaylistIDs = userPlaylists.map(
        (playlist: SpotifyApi.PlaylistObjectSimplified) => {
          return { id: playlist.id, name: playlist.name };
        }
      );
      axios.post("http://localhost:3001/data/setPlaylists", {
        userID,
        userPlaylistIDs,
      });
    }
  }, [userID, userPlaylists]);
};

export default useCreateUser;
