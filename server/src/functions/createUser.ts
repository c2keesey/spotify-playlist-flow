import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { UserModel } from "../database.js";

class CreateUserHandler extends SpotifyBaseHandler {
  async handle(event: HandlerEvent, context: HandlerContext) {
    const corsResponse = this.handleCors(event);
    if (corsResponse) return corsResponse;

    await this.initializeMongoDB();

    const body = JSON.parse(event.body || "{}");
    const { userID } = body;

    if (!userID) {
      return {
        statusCode: 400,
        headers: this.corsHeaders,
        body: JSON.stringify({
          message: "userID must be supplied.",
        }),
      };
    }

    try {
      const user = await UserModel.find({ userID: userID });
      if (user.length === 0) {
        const createdUser = await UserModel.create({ userID: userID });
        return {
          statusCode: 200,
          headers: this.corsHeaders,
          body: JSON.stringify(createdUser),
        };
      } else {
        return {
          statusCode: 200,
          headers: this.corsHeaders,
          body: JSON.stringify({ userID: user[0].userID }),
        };
      }
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        headers: this.corsHeaders,
        body: JSON.stringify({
          message: "Error processing request",
          error: err.message,
        }),
      };
    }
  }
}

const handler: Handler = async (event, context) => {
  const createUserHandler = new CreateUserHandler();
  return await createUserHandler.handle(event, context);
};

export { handler };
