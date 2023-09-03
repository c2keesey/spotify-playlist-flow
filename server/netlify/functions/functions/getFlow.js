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
var GetFlowHandler = /** @class */ (function (_super) {
    __extends(GetFlowHandler, _super);
    function GetFlowHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetFlowHandler.prototype.handleCors = function (event) {
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
    };
    GetFlowHandler.prototype.handle = function (event, context) {
        return __awaiter(this, void 0, void 0, function () {
            var newCors, corsResponse, _a, id, owner, flow, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newCors = {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET, OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type",
                            Allow: "GET",
                        };
                        corsResponse = this.handleCors(event);
                        if (corsResponse)
                            return [2 /*return*/, corsResponse];
                        return [4 /*yield*/, this.initializeMongoDB()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        _a = event.queryStringParameters, id = _a.id, owner = _a.owner;
                        if (!id || !owner) {
                            return [2 /*return*/, {
                                    statusCode: 400,
                                    headers: this.corsHeaders,
                                    body: JSON.stringify({
                                        message: "ID and owner parameters are required.",
                                    }),
                                }];
                        }
                        return [4 /*yield*/, PlaylistModel.find({ id: id, owner: owner })];
                    case 3:
                        flow = _b.sent();
                        return [2 /*return*/, {
                                statusCode: 200,
                                headers: this.corsHeaders,
                                body: JSON.stringify(flow),
                            }];
                    case 4:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [2 /*return*/, {
                                statusCode: 500,
                                headers: this.corsHeaders,
                                body: JSON.stringify({ message: "Error retrieving flow." }),
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return GetFlowHandler;
}(SpotifyBaseHandler));
var handler = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var getFlowHandler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getFlowHandler = new GetFlowHandler();
                return [4 /*yield*/, getFlowHandler.handle(event, context)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export { handler };
//# sourceMappingURL=getFlow.js.map