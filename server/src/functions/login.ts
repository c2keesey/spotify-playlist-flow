import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";

class LoginHandler extends SpotifyBaseHandler {
  async handle(event: HandlerEvent, context: HandlerContext) {
    const corsHeaders = {
      "Access-Control-Allow-Origin":
        "https://spotify-playlist-flow.netlify.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type", // Adjust this if you expect other headers in the actual request
    };

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
        headers: this.corsHeaders,
        body: JSON.stringify({
          message: "Authorization code must be supplied.",
        }),
      };
    }

    try {
      const data = await this.spotifyApi.authorizationCodeGrant(authCode);
      const resBody = JSON.stringify({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });

      return {
        statusCode: 200,
        headers: this.corsHeaders,
        body: resBody,
      };
    } catch (err) {
      const resBody = JSON.stringify({
        error: "Error during authorizationCodeGrant:",
      });

      return {
        statusCode: 400,
        headers: this.corsHeaders,
        body: resBody,
      };
    }
  }
}

const handler: Handler = async (event, context) => {
  const loginHandler = new LoginHandler();
  return await loginHandler.handle(event, context);
};

export { handler };
