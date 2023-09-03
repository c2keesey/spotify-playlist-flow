var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel } from "../database.js";
var SyncPlaylistsHandler = /** @class */ (function (_super) {
    __extends(SyncPlaylistsHandler, _super);
    function SyncPlaylistsHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SyncPlaylistsHandler.prototype.getPlaylistTrackURIs = function (playlistID) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, limit, offset, hasNextPage, tracks, trackResponse, rawTracks, filteredTracks, err_1;
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
                        return [4 /*yield*/, this.spotifyApi.getPlaylistTracks(playlistID, {
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
                        err_1 = _a.sent();
                        console.error("Error getting tracks for playlist: ".concat(playlistID), err_1);
                        return [3 /*break*/, 6];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, tracks];
                }
            });
        });
    };
    SyncPlaylistsHandler.prototype.updatePlaylist = function (playlist) {
        return __awaiter(this, void 0, void 0, function () {
            var tracks, _loop_1, this_1, _i, _a, downstreamPlaylist;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getPlaylistTrackURIs(playlist.id)];
                    case 1:
                        tracks = _b.sent();
                        _loop_1 = function (downstreamPlaylist) {
                            var downstreamTracks, filteredTracks, tracksLeft, err_2;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, this_1.getPlaylistTrackURIs(downstreamPlaylist)];
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
                                        return [4 /*yield*/, this_1.spotifyApi.addTracksToPlaylist(downstreamPlaylist, filteredTracks.slice(filteredTracks.length - tracksLeft, tracksLeft > 100
                                                ? filteredTracks.length - tracksLeft + 100
                                                : undefined))];
                                    case 4:
                                        _c.sent();
                                        tracksLeft -= 100;
                                        return [3 /*break*/, 6];
                                    case 5:
                                        err_2 = _c.sent();
                                        console.error("Unable to add tracks to playlist: ".concat(downstreamPlaylist), err_2);
                                        return [3 /*break*/, 7];
                                    case 6: return [3 /*break*/, 2];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
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
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SyncPlaylistsHandler.prototype.handle = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var corsResponse, _a, userID, accessToken, playlists, nextUpdateBatch, _i, nextUpdateBatch_1, playlist, error_1, nextUpdateBatchTemp, _loop_2, _b, nextUpdateBatch_2, playlist, batchSet, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        corsResponse = this.handleCors(event);
                        if (corsResponse)
                            return [2 /*return*/, corsResponse];
                        return [4 /*yield*/, this.initializeMongoDB()];
                    case 1:
                        _c.sent();
                        _a = JSON.parse(event.body || "{}"), userID = _a.userID, accessToken = _a.accessToken;
                        this.spotifyApi.setAccessToken(accessToken);
                        if (!userID) {
                            return [2 /*return*/, {
                                    statusCode: 400,
                                    headers: this.corsHeaders,
                                    body: JSON.stringify({ message: "Owner parameter is required." }),
                                }];
                        }
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 12, , 13]);
                        return [4 /*yield*/, PlaylistModel.find({
                                owner: userID,
                                changed: true,
                            })];
                    case 3:
                        playlists = _c.sent();
                        nextUpdateBatch = playlists.filter(function (playlist) {
                            return playlist.upstream.length === 0 && playlist.downstream.length > 0;
                        });
                        _c.label = 4;
                    case 4:
                        if (!(nextUpdateBatch.length != 0)) return [3 /*break*/, 11];
                        _i = 0, nextUpdateBatch_1 = nextUpdateBatch;
                        _c.label = 5;
                    case 5:
                        if (!(_i < nextUpdateBatch_1.length)) return [3 /*break*/, 10];
                        playlist = nextUpdateBatch_1[_i];
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.updatePlaylist(playlist)];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _c.sent();
                        console.error("Error updating playlist: ".concat(playlist.id), error_1);
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 5];
                    case 10:
                        nextUpdateBatchTemp = [];
                        _loop_2 = function (playlist) {
                            nextUpdateBatchTemp.push.apply(nextUpdateBatchTemp, playlists.filter(function (nextPlaylist) {
                                return nextPlaylist.upstream.includes(playlist.id);
                            }));
                        };
                        for (_b = 0, nextUpdateBatch_2 = nextUpdateBatch; _b < nextUpdateBatch_2.length; _b++) {
                            playlist = nextUpdateBatch_2[_b];
                            _loop_2(playlist);
                        }
                        batchSet = new Set(nextUpdateBatchTemp);
                        nextUpdateBatch = Array.from(batchSet);
                        return [3 /*break*/, 4];
                    case 11: return [2 /*return*/, {
                            statusCode: 200,
                            headers: this.corsHeaders,
                            body: JSON.stringify({ message: "Success syncing playlists" }),
                        }];
                    case 12:
                        error_2 = _c.sent();
                        console.error(error_2);
                        return [2 /*return*/, {
                                statusCode: 500,
                                headers: this.corsHeaders,
                                body: JSON.stringify({ message: "Error syncing playlists" }),
                            }];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return SyncPlaylistsHandler;
}(SpotifyBaseHandler));
var handler = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var syncPlaylistsHandler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                syncPlaylistsHandler = new SyncPlaylistsHandler();
                return [4 /*yield*/, syncPlaylistsHandler.handle(event, context)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export { handler };
//# sourceMappingURL=sync.js.map