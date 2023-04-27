import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface PlaylistSchemaI {
  id: string;
  owner: string;
  parents: string[];
  children: string[];
}

export const PlaylistSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  parents: {
    type: [String],
    default: [],
  },
  children: {
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
