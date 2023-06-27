import SpotifyWebApi from "spotify-web-api-node";
var client_id = "5e3726a0ec3f4360bf3d47eb34207aa8";
var redirect_uri = "http://localhost:3000";
var client_secret = process.env.client_secret;
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: client_id,
    clientSecret: client_secret,
});
export default spotifyApi;
//# sourceMappingURL=spotifyApi.js.map