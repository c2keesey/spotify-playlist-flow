import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";

const useCreateUser = () => {
  const { userPlaylists, userID } = useSpotify();

  useEffect(() => {
    if (userID) {
      axios
        .post("http://localhost:3001/data/createUser", {
          userID,
        })
        .then((res) => {
          // Handle success here
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      const userPlaylistIDs: string[] = userPlaylists.map(
        (playlist: SpotifyApi.PlaylistObjectSimplified) => {
          return playlist.id;
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
