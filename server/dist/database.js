import mongoose from "mongoose";
var Schema = mongoose.Schema;
export var PlaylistSchema = new Schema({
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
export var UserSchema = new Schema({
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
export var UserModel = mongoose.model("User", UserSchema);
export var PlaylistModel = mongoose.model("Playlist", PlaylistSchema);
//# sourceMappingURL=database.js.map