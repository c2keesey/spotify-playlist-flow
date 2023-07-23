import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";

class RefreshHandler extends SpotifyBaseHandler {
  async handle(event: HandlerEvent, context: HandlerContext) {
    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

    const body = JSON.parse(event.body || "{}");
    const { refreshToken } = body;

    if (!refreshToken) {
      return {
        statusCode: 400,
        headers: this.corsHeaders,
        body: JSON.stringify({
          message: "Refresh token must be supplied.",
        }),
      };
    }

    this.spotifyApi.setRefreshToken(refreshToken);

    try {
      const data = await this.spotifyApi.refreshAccessToken();
      const resBody = JSON.stringify({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });

      return {
        statusCode: 200,
        headers: this.corsHeaders,
        body: resBody,
      };
    } catch (err) {
      const resBody = JSON.stringify({
        error: "Error refreshing access token",
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
  const refreshHandler = new RefreshHandler();
  return await refreshHandler.handle(event, context);
};

export { handler };
