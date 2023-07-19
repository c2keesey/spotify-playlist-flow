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
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { Allow: "POST" },
    };
  }

  const body = JSON.parse(event.body || "{}");
  const { code } = body;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Authorization code must be supplied." }),
    };
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const resBody = JSON.stringify({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });

    return {
      statusCode: 200,
      body: resBody,
    };
  } catch (err) {
    const resBody = JSON.stringify({
      error: "Error during authorizationCodeGrant:",
      errorMessage: err.message,
    });

    return {
      statusCode: err.statusCode || 400,
      body: resBody,
    };
  }
};

export { handler };
