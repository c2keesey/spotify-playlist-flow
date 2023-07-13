import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";

const useGetFlow = () => {
  const {
    currentPlaylist,
    userPlaylists,
    userID,
    curPlaylistUpdated,
    setCurPlaylistUpdated,
    setCurUpstream,
    setCurDownstream,
  } = useSpotify();

  useEffect(() => {
    if (!currentPlaylist) return;
    axios
      .get("http://localhost:3001/data/getFlow", {
        params: {
          id: currentPlaylist.id,
          owner: userID,
        },
      })
      .then((res) => {
        setCurUpstream(
          res.data[0].upstream
            .map((id: string) =>
              userPlaylists.find((playlist) => playlist.id === id)
            )
            .filter(Boolean)
            .map(
              (playlist: SpotifyApi.PlaylistObjectSimplified) => playlist.name
            )
        );

        setCurDownstream(
          res.data[0].downstream
            .map((id: string) =>
              userPlaylists.find((playlist) => playlist.id === id)
            )
            .filter(Boolean)
            .map(
              (playlist: SpotifyApi.PlaylistObjectSimplified) => playlist.name
            )
        );
      })
      .catch((err) => {
        console.error(err);
      });
    setCurPlaylistUpdated(false);
  }, [currentPlaylist, curPlaylistUpdated]);
};

export default useGetFlow;
