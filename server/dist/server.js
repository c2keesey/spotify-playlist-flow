import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../../secret.env") });
var client_id = "5e3726a0ec3f4360bf3d47eb34207aa8";
var redirect_uri = "http://localhost:3000";
var client_secret = process.env.client_secret;
function createServer() {
    var app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.post("/refresh", function (req, res) {
        var refreshToken = req.body.refreshToken;
        var spotifyApi = new SpotifyWebApi({
            redirectUri: redirect_uri,
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refreshToken,
        });
        spotifyApi
            .refreshAccessToken()
            .then(function (data) {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            });
            // Save the access token so that it's used in future calls
            // spotifyApi.setAccessToken(data.body["access_token"]);
        })
            .catch(function () {
            res.sendStatus(400);
        });
    });
    app.post("/login", function (req, res) {
        var code = req.body.authCode;
        var spotifyApi = new SpotifyWebApi({
            redirectUri: redirect_uri,
            clientId: client_id,
            clientSecret: client_secret,
        });
        spotifyApi
            .authorizationCodeGrant(code)
            .then(function (data) {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
        })
            .catch(function (err) {
            console.log(err);
            res.sendStatus(400);
        });
    });
    app.listen(3001);
}
createServer();
export { createServer };
//# sourceMappingURL=server.js.map