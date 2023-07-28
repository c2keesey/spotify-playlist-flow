import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";

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
        .post(
          "https://spotify-playlist-flow-server.netlify.app/.netlify/functions/createUser",
          {
            userID,
          }
        )
        .then(() => {
          axios.post(
            "https://spotify-playlist-flow-server.netlify.app/.netlify/functions/setPlaylists",
            {
              userID,
              userPlaylistIDs,
            }
          );
        });
    }
  }, [userID, userPlaylists]);
};

export default useCreateUser;
