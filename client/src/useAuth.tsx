import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  authCode: string;
}

const useAuth = ({ authCode }: Props) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
      .post(
        // "https://spotify-playlist-flow-server.netlify.app/.netlify/functions/login",
        "http://localhost:9999/.netlify/functions/login",
        {
          authCode,
        }
      )
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);

        console.log(res.data);

        window.history.pushState({}, "", "/");
      })
      .catch((err) => {
        console.log(err);

        window.location.href = "/";
      });
  }, [authCode]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(
          // "http://spotify-playlist-flow-server.netlify.app/.netlify/functions/refresh",
          "http://localhost:9999/.netlify/functions/refresh",
          {
            refreshToken,
          }
        )
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          window.location.href = "/";
        });
    }, (expiresIn - 60) * 1000);
    clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;
