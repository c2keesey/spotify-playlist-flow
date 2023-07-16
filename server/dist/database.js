import mongoose from "mongoose";
var Schema = mongoose.Schema;
// ids and upstream downstream ids will be the UUID spotify provides and will be referenced as such
export var PlaylistSchema = new Schema({
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
    changed: {
        type: Boolean,
        default: false,
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