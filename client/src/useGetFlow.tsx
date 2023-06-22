import { useEffect } from "react";
import axios from "axios";
import { useSpotify } from "./SpotifyContext";

const useGetFlow = () => {
  const { currentPlaylist, userID, setCurUpstream, setCurDownstream } =
    useSpotify();

  useEffect(() => {
    axios
      .get("http://localhost:3001/data/getFlow", {
        params: {
          id: currentPlaylist?.id,
          owner: userID,
        },
      })
      .then((res) => {
        setCurUpstream(res.data[0].upstream);
        setCurDownstream(res.data[0].downstream);
        console.log("set flow");
        console.log(res.data[0].upstream);
        console.log(res.data[0].downstream);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentPlaylist, userID]);
};

export default useGetFlow;
