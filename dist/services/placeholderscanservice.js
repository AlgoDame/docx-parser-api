"use strict";
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderService = void 0;
var fs_1 = __importDefault(require("fs"));
var documentparser_1 = __importDefault(require("./documentparser"));
var dotenv_1 = __importDefault(require("dotenv"));
var https_1 = __importDefault(require("https"));
var is_url_1 = __importDefault(require("is-url"));
var filevalidator_1 = __importDefault(require("../utils/filevalidator"));
var cleanscanfiles_1 = require("./cleanscanfiles");
var logger_1 = __importDefault(require("../logger/logger"));
var imageplaceholder_service_1 = require("./imageplaceholder-service");
var cleanimgextractfiles_1 = require("./cleanimgextractfiles");
dotenv_1.default.config();
var imgExtractDestination = process.env.WORKING_DIR + "/downloads/image-extract";
var PlaceholderService = /** @class */ (function () {
    function PlaceholderService() {
    }
    PlaceholderService.prototype.scan = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var url, isValid, fileValidity, fileToDownload, workingDir_1, timestamp, filePath_1, scanfile_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!req.body.url) {
                            return [2 /*return*/, res.status(400).json({
                                    status: "Error",
                                    message: "No url provided"
                                })];
                        }
                        url = req.body.url;
                        isValid = is_url_1.default(url);
                        if (!isValid) {
                            return [2 /*return*/, res.status(404).json({
                                    status: "Error",
                                    message: "Please provide a valid url"
                                })];
                        }
                        return [4 /*yield*/, filevalidator_1.default(url)];
                    case 1:
                        fileValidity = _a.sent();
                        if (fileValidity.ext !== "docx") {
                            return [2 /*return*/, res.status(400).json({
                                    status: "Error",
                                    message: "Only docx file is supported for this operation"
                                })];
                        }
                        fileToDownload = url;
                        workingDir_1 = process.env.WORKING_DIR + "/downloads/scan";
                        timestamp = Date.now();
                        filePath_1 = workingDir_1 + "/scan_file_" + timestamp + ".docx";
                        scanfile_1 = fs_1.default.createWriteStream(filePath_1);
                        return [4 /*yield*/, https_1.default.get(fileToDownload, function (response) {
                                response.pipe(scanfile_1);
                            })];
                    case 2:
                        _a.sent();
                        scanfile_1.on('finish', function () { return __awaiter(_this, void 0, void 0, function () {
                            var placeholders, imagePlaceholders;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        logger_1.default.info("done writing to file");
                                        return [4 /*yield*/, documentparser_1.default(filePath_1)];
                                    case 1:
                                        placeholders = _a.sent();
                                        imagePlaceholders = imageplaceholder_service_1.getImagePlaceholders.extract(filePath_1, imgExtractDestination).then(function (responseObj) {
                                            var images = responseObj.images;
                                            if (placeholders === null && !images) {
                                                return res.status(204).json({});
                                            }
                                            if (placeholders || images) {
                                                cleanscanfiles_1.cleanUpScanFiles(workingDir_1);
                                                cleanimgextractfiles_1.cleanUpImageFiles(imgExtractDestination);
                                                return res.status(200).json({
                                                    status: "Success",
                                                    placeholders: placeholders,
                                                    imagePlaceholders: images
                                                });
                                            }
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                status: "Error",
                                Error: error_1.message
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PlaceholderService;
}());
exports.PlaceholderService = PlaceholderService;
