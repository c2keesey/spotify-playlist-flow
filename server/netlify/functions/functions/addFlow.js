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
import { SpotifyBaseHandler } from "../function_helpers/spotifyBaseHandler";
import { PlaylistModel } from "../database.js";
var SUCCESS_STATUS = 200;
var ERROR_STATUS = 500;
var ProcessingError = /** @class */ (function (_super) {
    __extends(ProcessingError, _super);
    function ProcessingError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ProcessingError";
        return _this;
    }
    return ProcessingError;
}(Error));
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
    var allPlaylists_1, userPlaylists, err_1, flowType, filter, update, updateCurrentResult, targetFilter, targetFlowType, targetUpdate, updateTargetResult, error_1;
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
                err_1 = _c.sent();
                console.error("Error occurred during adding flow:", err_1);
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
                error_1 = _c.sent();
                console.error("Error occurred during adding flow:", error_1);
                return [2 /*return*/, { success: false, status: 500, message: "Error adding flow" }];
            case 7: return [2 /*return*/];
        }
    });
}); };
var AddFlowHandler = /** @class */ (function (_super) {
    __extends(AddFlowHandler, _super);
    function AddFlowHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddFlowHandler.prototype.handle = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var corsResponse, body, results, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        corsResponse = this.handleCors(event);
                        if (corsResponse)
                            return [2 /*return*/, corsResponse];
                        return [4 /*yield*/, this.initializeMongoDB()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        body = this.validateAndParseBody(event.body);
                        return [4 /*yield*/, this.processFlows(body)];
                    case 3:
                        results = _a.sent();
                        if (results.some(function (result) { return !result.success; })) {
                            return [2 /*return*/, this.buildErrorResponse("Error adding some flows")];
                        }
                        if (results.some(function (result) { return result.status === 400; })) {
                            return [2 /*return*/, this.buildErrorResponse("Error: cycle detected. Some flows were not added")];
                        }
                        return [2 /*return*/, this.buildSuccessResponse(results)];
                    case 4:
                        err_2 = _a.sent();
                        return [2 /*return*/, this.buildErrorResponse(err_2.message)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // targetPlaylists are playlist IDs
    AddFlowHandler.prototype.validateAndParseBody = function (body) {
        // TODO: Add input validation logic
        return JSON.parse(body || "{}");
    };
    // TODO: add error handling
    AddFlowHandler.prototype.resetFlows = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var flowType, filter, update, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        flowType = body.isUpstream ? "upstream" : "downstream";
                        filter = { id: body.currentPlaylist, owner: body.userID };
                        update = {
                            $set: (_a = {}, _a[flowType] = [], _a),
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, PlaylistModel.updateMany(filter, update)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        throw new Error("Failed to reset current playlist:");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Removes current playlist from deselected targets' flows
    AddFlowHandler.prototype.updateTargets = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var flowType, oldTargets, toUpdate, promises, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Updating targets");
                        console.log(body);
                        flowType = !body.isUpstream ? "upstream" : "downstream";
                        oldTargets = body.isUpstream
                            ? body.curUpstream.map(function (target) { return target[1]; })
                            : body.curDownstream.map(function (target) { return target[1]; });
                        console.log("old targets: ", oldTargets);
                        if (!oldTargets || oldTargets.length === 0)
                            return [2 /*return*/];
                        toUpdate = oldTargets.filter(function (target) { return !body.targetPlaylists.includes(target); });
                        if (toUpdate.length === 0)
                            return [2 /*return*/];
                        console.log(toUpdate);
                        promises = toUpdate.map(function (target) { return __awaiter(_this, void 0, void 0, function () {
                            var filter, update, error_4;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        filter = { id: target, owner: body.userID };
                                        update = {
                                            $pull: (_a = {}, _a[flowType] = body.currentPlaylist, _a),
                                        };
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, PlaylistModel.updateMany(filter, update)];
                                    case 2:
                                        _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_4 = _b.sent();
                                        throw new Error("Failed to update target ".concat(target));
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AddFlowHandler.prototype.processFlows = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_5, _i, _a, playlist, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        results = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.resetFlows(body)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.updateTargets(body)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _b.sent();
                        console.error(error_5);
                        throw new ProcessingError("Failed to reset flows or update targets");
                    case 5:
                        _i = 0, _a = body.targetPlaylists;
                        _b.label = 6;
                    case 6:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        playlist = _a[_i];
                        return [4 /*yield*/, addSingleFlow(body.userID, body.currentPlaylist, playlist, body.isUpstream)];
                    case 7:
                        result = _b.sent();
                        results.push(result);
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, results];
                }
            });
        });
    };
    AddFlowHandler.prototype.buildSuccessResponse = function (results) {
        return {
            statusCode: SUCCESS_STATUS,
            headers: this.corsHeaders,
            body: JSON.stringify(results),
        };
    };
    AddFlowHandler.prototype.buildErrorResponse = function (message) {
        return {
            statusCode: ERROR_STATUS,
            headers: this.corsHeaders,
            body: JSON.stringify({ message: message }),
        };
    };
    return AddFlowHandler;
}(SpotifyBaseHandler));
var handler = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var addFlowHandler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                addFlowHandler = new AddFlowHandler();
                return [4 /*yield*/, addFlowHandler.handle(event, context)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export { handler };
//# sourceMappingURL=addFlow.js.map