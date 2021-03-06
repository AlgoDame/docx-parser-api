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
exports.GooglePdfConverter = void 0;
var googleapis_1 = require("googleapis");
var fs_1 = __importDefault(require("fs"));
var logger_1 = __importDefault(require("../../logger/logger"));
var GooglePdfConverter = /** @class */ (function () {
    function GooglePdfConverter() {
    }
    GooglePdfConverter.prototype.convert = function (pdfOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, inputPath, outputPath, parentFolder, fileId, removeFileResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auth = pdfOptions.auth;
                        inputPath = pdfOptions.inputFilePath;
                        outputPath = pdfOptions.outputFilePath;
                        parentFolder = pdfOptions.parentFolder;
                        return [4 /*yield*/, this.uploadFileToDrive(auth, inputPath, parentFolder)];
                    case 1:
                        fileId = _a.sent();
                        logger_1.default.info("converter class: file id " + fileId);
                        if (!fileId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.convertFile(auth, fileId, outputPath)];
                    case 2:
                        _a.sent();
                        logger_1.default.info("after converting file");
                        return [4 /*yield*/, this.deleteFromDrive(auth, fileId)];
                    case 3:
                        removeFileResponse = _a.sent();
                        if ((removeFileResponse === null || removeFileResponse === void 0 ? void 0 : removeFileResponse.status) === 204) {
                            //log.info(`Successfully deleted file: status is ${removeFileResponse.status}`);
                            logger_1.default.info("Successfully deleted file: status is " + removeFileResponse.status);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GooglePdfConverter.prototype.uploadFileToDrive = function (auth, inputPath, parentFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var driveService, fileMetaData, media, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        driveService = googleapis_1.google.drive({
                            version: "v3",
                            auth: auth
                        });
                        fileMetaData = {
                            "name": "awesome-file-" + Date.now() + ".docx",
                            "parents": [parentFolder],
                            mimeType: 'application/vnd.google-apps.document'
                        };
                        media = {
                            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            body: fs_1.default.createReadStream(inputPath)
                        };
                        return [4 /*yield*/, driveService.files.create({
                                requestBody: fileMetaData,
                                media: media,
                                fields: "id"
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            //log.info(`file id: ${response.data.id}`)
                            logger_1.default.info("file id: " + response.data.id);
                            return [2 /*return*/, response.data.id];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.default.info(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GooglePdfConverter.prototype.convertFile = function (auth, fileId, outputPath) {
        return __awaiter(this, void 0, void 0, function () {
            var driveService, exportFile, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        driveService = googleapis_1.google.drive({
                            version: "v3",
                            auth: auth
                        });
                        return [4 /*yield*/, driveService.files.export({
                                fileId: fileId,
                                mimeType: "application/pdf",
                            }, { responseType: "stream" }, function (err, response) {
                                if (err) {
                                    //log.error(err);
                                    logger_1.default.info(err);
                                    return;
                                }
                                response.data.on("error", function (err) {
                                    //log.error(err);
                                    logger_1.default.info(err);
                                    return;
                                }).on("end", function () {
                                    //log.info("done converting file to pdf")
                                    logger_1.default.info("done converting file to pdf");
                                }).pipe(outputPath);
                            })];
                    case 1:
                        exportFile = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        //log.error(error);
                        logger_1.default.info(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GooglePdfConverter.prototype.deleteFromDrive = function (auth, fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var driveService, removedFile, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        driveService = googleapis_1.google.drive({
                            version: "v3",
                            auth: auth
                        });
                        return [4 /*yield*/, driveService.files.delete({
                                fileId: fileId
                            })];
                    case 1:
                        removedFile = _a.sent();
                        logger_1.default.info("the removed google doc file , " + removedFile);
                        return [2 /*return*/, removedFile];
                    case 2:
                        error_3 = _a.sent();
                        //log.error(error);
                        logger_1.default.info(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return GooglePdfConverter;
}());
exports.GooglePdfConverter = GooglePdfConverter;
