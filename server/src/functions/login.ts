import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";

class LoginHandler extends SpotifyBaseHandler {
  async handle(event: HandlerEvent, context: HandlerContext) {
    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

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
