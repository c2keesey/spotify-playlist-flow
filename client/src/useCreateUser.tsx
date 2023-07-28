import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";
import BASE_URL from "./routing";

const useCreateUser = () => {
  const { userPlaylists, userID } = useSpotify();

  useEffect(() => {
    if (userID && userPlaylists.length > 0) {
      const userPlaylistIDs = userPlaylists.map(
        (playlist: SpotifyApi.PlaylistObjectSimplified) => {
          return { id: playlist.id, name: playlist.name };
        }
      );
      axios
        .post(`${BASE_URL}/createUser`, {
          userID,
        })
        .then(() => {
          axios.post(`${BASE_URL}/setPlaylists`, {
            userID,
            userPlaylistIDs,
          });
        });
    }
  }, [userID, userPlaylists]);
};

export default useCreateUser;
