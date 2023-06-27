import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface PlaylistSchemaI {
  name: string;
  id: string;
  owner: string;
  upstream: string[];
  downstream: string[];
}

// ids and upstream downstream ids will be the UUID spotify provides and will be referenced as such
export const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  upstream: {
    type: [String],
    default: [],
  },
  downstream: {
    type: [String],
    default: [],
  },
});

export const UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  playlists: {
    type: [PlaylistSchema],
    default: [],
  },
});

export const UserModel = mongoose.model("User", UserSchema);
export const PlaylistModel = mongoose.model("Playlist", PlaylistSchema);
