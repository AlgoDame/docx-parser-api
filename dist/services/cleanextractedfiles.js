"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpExtractedFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var logger_1 = __importDefault(require("../logger/logger"));
function cleanUpExtractedFiles(directory) {
    try {
        fs_1.default.readdir(directory, function (err, files) {
            if (err) {
                logger_1.default.error(err);
                return;
            }
            logger_1.default.info("deleting extracted files " + files);
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                if (fs_1.default.lstatSync(path_1.default.join(directory, file)).isFile()) {
                    fs_1.default.unlink(path_1.default.join(directory, file), function (err) {
                        if (err) {
                            logger_1.default.error(err);
                            return;
                        }
                    });
                }
                if (fs_1.default.lstatSync(path_1.default.join(directory, file)).isDirectory()) {
                    fs_1.default.rmdir(path_1.default.join(directory, file), { recursive: true }, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            logger_1.default.info("extracted files deleted");
        });
    }
    catch (error) {
        logger_1.default.error(error);
    }
}
exports.cleanUpExtractedFiles = cleanUpExtractedFiles;
