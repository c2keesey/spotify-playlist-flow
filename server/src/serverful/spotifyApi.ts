import SpotifyWebApi from "spotify-web-api-node";

const client_id = "5e3726a0ec3f4360bf3d47eb34207aa8";
const redirect_uri = "http://localhost:3000";
const client_secret = process.env.client_secret;

const spotifyApi = new SpotifyWebApi({
  redirectUri: redirect_uri,
  clientId: client_id,
  clientSecret: client_secret,
});

export default spotifyApi;
