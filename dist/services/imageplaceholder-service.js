"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImagePlaceholders = void 0;
var fs_1 = __importDefault(require("fs"));
var unzipper_1 = __importDefault(require("unzipper"));
var logger_1 = __importDefault(require("../logger/logger"));
exports.getImagePlaceholders = {
    extract: function (filePath, extractDestination) {
        return new Promise(function (resolve, reject) {
            fs_1.default.createReadStream(filePath)
                .pipe(unzipper_1.default.Extract({ path: extractDestination }))
                .on("error", function () {
                logger_1.default.error(Error);
                reject(Error);
            })
                .on("close", function () {
                var imgDir = extractDestination + "/word/media";
                if (fs_1.default.existsSync(imgDir)) {
                    fs_1.default.readdir(imgDir, function (err, files) {
                        if (err) {
                            logger_1.default.error(err);
                            return;
                        }
                        ;
                        if (!files) {
                            logger_1.default.info("No image placeholders found in directory");
                            return;
                        }
                        ;
                        var responseObj = { images: files };
                        resolve(responseObj);
                        return responseObj;
                    });
                    return;
                }
                if (!fs_1.default.existsSync(imgDir)) {
                    var responseObj = { images: null };
                    resolve(responseObj);
                    return responseObj;
                }
            });
        });
    }
};
