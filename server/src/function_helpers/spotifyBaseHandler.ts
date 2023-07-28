import { HandlerEvent } from "@netlify/functions";
import mongoose, { ConnectOptions } from "mongoose";
import SpotifyWebApi from "spotify-web-api-node";

export abstract class SpotifyBaseHandler {
  protected corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  protected spotifyApi: SpotifyWebApi;

  constructor() {
    const client_id = process.env.client_id;
    const redirect_uri = process.env.redirect_uri;
    const client_secret = process.env.client_secret;

    this.spotifyApi = new SpotifyWebApi({
      redirectUri: redirect_uri,
      clientId: client_id,
      clientSecret: client_secret,
    });
  }

  protected async initializeMongoDB() {
    if (process.env.MONGO_URL) {
      try {
        await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as ConnectOptions);
        console.log("MongoDB connection established");
      } catch (error) {
        console.error("Error connecting to MongoDB", error);
      }
    } else {
      console.error("MONGO_URL not provided in environment variables");
    }
  }

  protected handleCors(event: HandlerEvent) {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: this.corsHeaders,
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed here",
        headers: { ...this.corsHeaders, Allow: "POST" },
      };
    }
    return null;
  }

  abstract handle(event: HandlerEvent, context: any): Promise<any>;
}
