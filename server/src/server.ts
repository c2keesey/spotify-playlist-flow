import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dataRoutes from "./dataRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../../secret.env") });

const client_id = "5e3726a0ec3f4360bf3d47eb34207aa8";
const redirect_uri = "http://localhost:3000";
const client_secret = process.env.client_secret;

const spotifyApi = new SpotifyWebApi({
  redirectUri: redirect_uri,
  clientId: client_id,
  clientSecret: client_secret,
});

function createServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // For debugging server only
  app.post("/setToken", (req, res) => {
    const { accessToken } = req.body;

    // Validate that accessToken was supplied
    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "Access token must be supplied." });
    }

    // Set the access token
    spotifyApi.setAccessToken(accessToken);

    res.status(200).json({ message: "Access token set successfully." });
    console.log("Access token set successfully.");
  });


  app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;

    spotifyApi.setRefreshToken(refreshToken);

    spotifyApi
      .refreshAccessToken()
      .then((data) => {
        res.json({
          accessToken: data.body.access_token,
          expiresIn: data.body.expires_in,
        });
      })
      .catch(() => {
        console.log("error");
        res.sendStatus(400);
      });
  });

  app.post("/login", (req: Request, res: Response) => {
    const code = req.body.authCode;

    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        });
        spotifyApi.setAccessToken(data.body.access_token);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  });

  if (process.env.MONGO_URL != undefined) {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as any)
      .then(() => console.log("database connected"))
      .catch((err) => console.log(err));

    mongoose.connection.on("connected", () => {
      console.log("Mongoose is connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
  } else {
    console.log("missing mongoDB url");
  }

  app.use("/data", dataRoutes);

  app.listen(3001);
}

createServer();

export { createServer, spotifyApi };
