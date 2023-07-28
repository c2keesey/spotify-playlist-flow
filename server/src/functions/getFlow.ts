import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel } from "../database.js";

interface QueryStringParameters {
  id?: string;
  owner?: string;
}

class GetFlowHandler extends SpotifyBaseHandler {
  protected handleCors(event: HandlerEvent) {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          Allow: "GET",
        },
        body: "",
      };
    }

    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: "Method Not Allowed here",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          Allow: "GET",
        },
      };
    }
    return null;
  }

  async handle(event: HandlerEvent, context: HandlerContext): Promise<any> {
    const newCors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Allow: "GET",
    };

    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

    await this.initializeMongoDB();

    try {
      const { id, owner } =
        event.queryStringParameters as QueryStringParameters;

      if (!id || !owner) {
        return {
          statusCode: 400,
          headers: this.corsHeaders,
          body: JSON.stringify({
            message: "ID and owner parameters are required.",
          }),
        };
      }

      const flow = await PlaylistModel.find({ id: id, owner: owner });

      return {
        statusCode: 200,
        headers: this.corsHeaders,
        body: JSON.stringify(flow),
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        headers: this.corsHeaders,
        body: JSON.stringify({ message: "Error retrieving flow." }),
      };
    }
  }
}

const handler: Handler = async (event, context) => {
  const getFlowHandler = new GetFlowHandler();
  return await getFlowHandler.handle(event, context);
};

export { handler };
