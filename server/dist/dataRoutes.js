var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from "express";
import { UserModel, PlaylistModel } from "./database.js";
import { spotifyApi } from "./server.js";
var dataRoutes = express.Router();
var createOrUpdatePlaylist = function (id, userID, name) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, update, options, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                filter = { id: id };
                update = { id: id, owner: userID, name: name };
                options = { upsert: true, new: true, setDefaultsOnInsert: true };
                return [4 /*yield*/, PlaylistModel.findOneAndUpdate(filter, update, options)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_1 = _a.sent();
                console.error("Error occurred during playlist creation or update:", error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
dataRoutes.post("/setPlaylists", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playlistIDs, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                playlistIDs = req.body.userPlaylistIDs.map(function (playlist) { return playlist.id; });
                // Create or update playlists
                return [4 /*yield*/, Promise.all(req.body.userPlaylistIDs.map(function (playlist) {
                        return createOrUpdatePlaylist(playlist.id, req.body.userID, playlist.name);
                    }))];
            case 1:
                // Create or update playlists
                _a.sent();
                console.log("update playlist success");
                // Remove playlists not in req.body
                return [4 /*yield*/, PlaylistModel.deleteMany({
                        owner: req.body.userID,
                        id: { $nin: playlistIDs },
                    })];
            case 2:
                // Remove playlists not in req.body
                _a.sent();
                res.status(200).send({ message: "Playlists updated successfully" });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).send({ message: "Error updating playlists" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
dataRoutes.post("/createUser", function (req, res) {
    UserModel.find({ userID: req.body.userID })
        .then(function (user) {
        if (user.length === 0) {
            console.log("creating user");
            UserModel.create({
                userID: req.body.userID,
            })
                .then(function (createdUser) {
                res.send(createdUser);
            })
                .catch(function (createUserErr) {
                console.error(createUserErr);
                res.status(500).send({ message: "Error creating user" });
            });
        }
        else {
            res.send(user[0].userID);
        }
    })
        .catch(function (findUserErr) {
        console.error(findUserErr);
        res.status(500).send({ message: "Error finding user" });
    });
});
dataRoutes.get("/getFlow", function (req, res) {
    PlaylistModel.find({ id: req.query.id, owner: req.query.owner }).then(function (flow) {
        res.send(flow);
    });
});
var getPlaylistTrackURIs = function (playlistID) { return __awaiter(void 0, void 0, void 0, function () {
    var fields, limit, offset, hasNextPage, tracks, trackResponse, rawTracks, filteredTracks, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fields = "items(track(uri)),next";
                limit = 50;
                offset = 0;
                hasNextPage = true;
                tracks = [];
                _a.label = 1;
            case 1:
                if (!hasNextPage) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, spotifyApi.getPlaylistTracks(playlistID, {
                        offset: offset,
                        limit: limit,
                        fields: fields,
                    })];
            case 3:
                trackResponse = _a.sent();
                rawTracks = trackResponse.body.items.map(function (item) {
                    var _a;
                    return (_a = item.track) === null || _a === void 0 ? void 0 : _a.uri;
                });
                filteredTracks = rawTracks.filter(function (track) { return track !== undefined; });
                tracks.push.apply(tracks, filteredTracks);
                hasNextPage = trackResponse.body.next !== null;
                offset += limit;
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                console.error("Error getting tracks for playlist: ".concat(playlistID), err_2);
                return [3 /*break*/, 6];
            case 5: return [3 /*break*/, 1];
            case 6: return [2 /*return*/, tracks];
        }
    });
}); };
var updatePlaylist = function (playlist) { return __awaiter(void 0, void 0, void 0, function () {
    var tracks, _loop_1, _i, _a, downstreamPlaylist;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getPlaylistTrackURIs(playlist.id)];
            case 1:
                tracks = _b.sent();
                _loop_1 = function (downstreamPlaylist) {
                    var downstreamTracks, filteredTracks, tracksLeft, err_3;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getPlaylistTrackURIs(downstreamPlaylist)];
                            case 1:
                                downstreamTracks = _c.sent();
                                filteredTracks = tracks.filter(function (track) { return !downstreamTracks.includes(track); });
                                tracksLeft = filteredTracks.length;
                                _c.label = 2;
                            case 2:
                                if (!(tracksLeft > 0)) return [3 /*break*/, 7];
                                _c.label = 3;
                            case 3:
                                _c.trys.push([3, 5, , 6]);
                                return [4 /*yield*/, spotifyApi.addTracksToPlaylist(downstreamPlaylist, filteredTracks.slice(filteredTracks.length - tracksLeft, tracksLeft > 100
                                        ? filteredTracks.length - tracksLeft + 100
                                        : undefined))];
                            case 4:
                                _c.sent();
                                tracksLeft -= 100;
                                return [3 /*break*/, 6];
                            case 5:
                                err_3 = _c.sent();
                                console.error("Unable to add tracks to playlist: ".concat(downstreamPlaylist), err_3);
                                return [3 /*break*/, 7];
                            case 6: return [3 /*break*/, 2];
                            case 7: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = playlist.downstream;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                downstreamPlaylist = _a[_i];
                return [5 /*yield**/, _loop_1(downstreamPlaylist)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("Success updating downstream playlists of ".concat(playlist.name));
                return [2 /*return*/];
        }
    });
}); };
dataRoutes.get("/syncPlaylists", function (req, res) {
    var owner = req.query.owner;
    PlaylistModel.find({ owner: owner, changed: true })
        .then(function (playlists) { return __awaiter(void 0, void 0, void 0, function () {
        var nextUpdateBatch, _i, nextUpdateBatch_1, playlist, error_2, nextUpdateBatchTemp, _loop_2, _a, nextUpdateBatch_2, playlist, batchSet;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nextUpdateBatch = playlists.filter(function (playlist) {
                        return playlist.upstream.length === 0 && playlist.downstream.length > 0;
                    });
                    _b.label = 1;
                case 1:
                    if (!(nextUpdateBatch.length != 0)) return [3 /*break*/, 8];
                    _i = 0, nextUpdateBatch_1 = nextUpdateBatch;
                    _b.label = 2;
                case 2:
                    if (!(_i < nextUpdateBatch_1.length)) return [3 /*break*/, 7];
                    playlist = nextUpdateBatch_1[_i];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, updatePlaylist(playlist)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.error("Error updating playlist: ".concat(playlist.id), error_2);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    nextUpdateBatchTemp = [];
                    _loop_2 = function (playlist) {
                        nextUpdateBatchTemp.push.apply(nextUpdateBatchTemp, playlists.filter(function (nextPlaylist) {
                            return nextPlaylist.upstream.includes(playlist.id);
                        }));
                    };
                    for (_a = 0, nextUpdateBatch_2 = nextUpdateBatch; _a < nextUpdateBatch_2.length; _a++) {
                        playlist = nextUpdateBatch_2[_a];
                        _loop_2(playlist);
                    }
                    batchSet = new Set(nextUpdateBatchTemp);
                    nextUpdateBatch = Array.from(batchSet);
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    }); })
        .then(function () {
        res.status(200).send({ message: "Success syncing playlists" });
    })
        .catch(function (error) {
        console.error(error);
        res.status(500).send({ message: "Error syncing playlists" });
    });
});
function hasCycle(playlists, currentPlaylist, targetPlaylist) {
    var visited = new Set();
    function dfs(node) {
        if (visited.has(node)) {
            return false;
        }
        visited.add(node);
        if (node === currentPlaylist) {
            return true;
        }
        for (var _i = 0, _a = playlists[node]; _i < _a.length; _i++) {
            var play = _a[_i];
            if (dfs(play)) {
                return true;
            }
        }
        return false;
    }
    return dfs(targetPlaylist);
}
var addSingleFlow = function (userID, currentPlaylist, targetPlaylist, isUpstream) { return __awaiter(void 0, void 0, void 0, function () {
    var allPlaylists_1, userPlaylists, err_4, flowType, filter, update, updateCurrentResult, targetFilter, targetFlowType, targetUpdate, updateTargetResult, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                allPlaylists_1 = {};
                return [4 /*yield*/, PlaylistModel.find({ owner: userID })];
            case 1:
                userPlaylists = _c.sent();
                userPlaylists.map(function (playlist) {
                    allPlaylists_1[playlist.id] = playlist.downstream;
                });
                if (hasCycle(allPlaylists_1, !isUpstream ? currentPlaylist : targetPlaylist, !isUpstream ? targetPlaylist : currentPlaylist)) {
                    return [2 /*return*/, { success: false, status: 400 }];
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _c.sent();
                console.error("Error occurred during adding flow:", err_4);
                return [2 /*return*/, { success: false, status: 500, message: "Error adding flow" }];
            case 3:
                _c.trys.push([3, 6, , 7]);
                flowType = isUpstream ? "upstream" : "downstream";
                filter = { id: currentPlaylist, owner: userID };
                update = __assign({ $addToSet: (_a = {}, _a[flowType] = targetPlaylist, _a) }, (isUpstream ? {} : { $set: { changed: true } }));
                return [4 /*yield*/, PlaylistModel.findOneAndUpdate(filter, update, {
                        new: true,
                    })];
            case 4:
                updateCurrentResult = _c.sent();
                targetFilter = { id: targetPlaylist, owner: userID };
                targetFlowType = !isUpstream ? "upstream" : "downstream";
                targetUpdate = __assign({ $addToSet: (_b = {}, _b[targetFlowType] = currentPlaylist, _b) }, (isUpstream ? { $set: { changed: true } } : {}));
                return [4 /*yield*/, PlaylistModel.findOneAndUpdate(targetFilter, targetUpdate, {
                        new: true,
                    })];
            case 5:
                updateTargetResult = _c.sent();
                return [2 /*return*/, {
                        success: true,
                        status: 200,
                        current: updateCurrentResult,
                        target: updateTargetResult,
                    }];
            case 6:
                error_3 = _c.sent();
                console.error("Error occurred during adding flow:", error_3);
                return [2 /*return*/, { success: false, status: 500, message: "Error adding flow" }];
            case 7: return [2 /*return*/];
        }
    });
}); };
dataRoutes.post("/addFlow", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userID, currentPlaylist, targetPlaylists, isUpstream, results, _i, targetPlaylists_1, playlist, result, _b, results_1, result;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, userID = _a.userID, currentPlaylist = _a.currentPlaylist, targetPlaylists = _a.targetPlaylists, isUpstream = _a.isUpstream;
                results = [];
                _i = 0, targetPlaylists_1 = targetPlaylists;
                _c.label = 1;
            case 1:
                if (!(_i < targetPlaylists_1.length)) return [3 /*break*/, 4];
                playlist = targetPlaylists_1[_i];
                return [4 /*yield*/, addSingleFlow(userID, currentPlaylist, playlist, isUpstream)];
            case 2:
                result = _c.sent();
                results.push(result);
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                for (_b = 0, results_1 = results; _b < results_1.length; _b++) {
                    result = results_1[_b];
                    if (!result.success) {
                        return [2 /*return*/, res.sendStatus(result.status)];
                    }
                }
                return [2 /*return*/, res.send(results)];
        }
    });
}); });
export default dataRoutes;
//# sourceMappingURL=dataRoutes.js.map