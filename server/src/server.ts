import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";
import bodyParser from "body-parser";

const client_id = "5e3726a0ec3f4360bf3d47eb34207aa8";
const redirect_uri = "http://localhost:3000";
const client_secret = "934c97538367432da6f621021539a4f2";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: redirect_uri,
      clientId: client_id,
      clientSecret: client_secret,
      refreshToken
    });

    spotifyApi
      .refreshAccessToken()
      .then((data) => {
        res.json({
          accessToken: data.body.access_token,
          expiresIn: data.body.expires_in
        })

        // Save the access token so that it's used in future calls
        // spotifyApi.setAccessToken(data.body["access_token"]);
      })
      .catch(() => {
        res.sendStatus(400);
      });
  });

  app.post("/login", (req: Request, res: Response) => {
    const code = req.body.authCode;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: redirect_uri,
      clientId: client_id,
      clientSecret: client_secret,
    });

    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  });

  app.listen(3001);
}

createServer();
``;

export { createServer };
