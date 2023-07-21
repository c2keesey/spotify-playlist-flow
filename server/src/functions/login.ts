import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import SpotifyWebApi from "spotify-web-api-node";

const client_id = process.env.client_id;
const redirect_uri = process.env.redirect_uri;
const client_secret = process.env.client_secret;

const spotifyApi = new SpotifyWebApi({
  redirectUri: redirect_uri,
  clientId: client_id,
  clientSecret: client_secret,
});

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  console.log("Request headers:", event.headers);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://spotify-playlist-flow.netlify.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type", // Adjust this if you expect other headers in the actual request
  };
  console.log("Response headers:", corsHeaders);

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "", // No content for OPTIONS responses
    };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed here",
      headers: { ...corsHeaders, Allow: "POST" },
    };
  }

  const body = JSON.parse(event.body || "{}");
  const { authCode } = body;

  if (!authCode) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Authorization code must be supplied." }),
    };
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(authCode);
    const resBody = JSON.stringify({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: resBody,
    };
  } catch (err) {
    const resBody = JSON.stringify({
      error: "Error during authorizationCodeGrant:",
    });

    return {
      statusCode: 400,
      headers: corsHeaders,
      body: resBody,
    };
  }
};

export { handler };
