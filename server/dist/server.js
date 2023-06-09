import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dataRoutes from "./dataRoutes.js";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../../secret.env") });
var client_id = "5e3726a0ec3f4360bf3d47eb34207aa8";
var redirect_uri = "http://localhost:3000";
var client_secret = process.env.client_secret;
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: client_id,
    clientSecret: client_secret,
});
function createServer() {
    var app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // For debugging server only
    app.post("/setToken", function (req, res) {
        var accessToken = req.body.accessToken;
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
    app.post("/refresh", function (req, res) {
        var refreshToken = req.body.refreshToken;
        spotifyApi.setRefreshToken(refreshToken);
        spotifyApi
            .refreshAccessToken()
            .then(function (data) {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            });
        })
            .catch(function () {
            console.log("error");
            res.sendStatus(400);
        });
    });
    app.post("/login", function (req, res) {
        var code = req.body.authCode;
        spotifyApi
            .authorizationCodeGrant(code)
            .then(function (data) {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
            spotifyApi.setAccessToken(data.body.access_token);
        })
            .catch(function (err) {
            console.log(err);
            res.sendStatus(400);
        });
    });
    if (process.env.MONGO_URL != undefined) {
        mongoose
            .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(function () { return console.log("database connected"); })
            .catch(function (err) { return console.log(err); });
        mongoose.connection.on("connected", function () {
            console.log("Mongoose is connected");
        });
        mongoose.connection.on("error", function (err) {
            console.log("Mongoose connection error: ".concat(err));
        });
        mongoose.connection.on("disconnected", function () {
            console.log("Mongoose disconnected");
        });
    }
    else {
        console.log("missing mongoDB url");
    }
    app.use("/data", dataRoutes);
    app.listen(3001);
}
createServer();
export { createServer, spotifyApi };
//# sourceMappingURL=server.js.map