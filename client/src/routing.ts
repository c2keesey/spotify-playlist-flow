const PROD_URL: string =
  "https://accounts.spotify.com/authorize?client_id=5e3726a0ec3f4360bf3d47eb34207aa8&response_type=code&redirect_uri=https://spotify-playlist-flow.netlify.app&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20playlist-modify-public%20playlist-modify-private%20playlist-read-private";

const DEV_URL: string =
  "https://accounts.spotify.com/authorize?client_id=5e3726a0ec3f4360bf3d47eb34207aa8&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20playlist-modify-public%20playlist-modify-private%20playlist-read-private";

export const AUTH_URL =
  process.env.NODE_ENV === "development" ? DEV_URL : PROD_URL;

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9999/.netlify/functions"
    : "http://spotify-playlist-flow-server.netlify.app/.netlify/functions";

export default BASE_URL;
