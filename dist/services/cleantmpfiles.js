"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpTempFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var logger_1 = __importDefault(require("../logger/logger"));
function cleanUpTempFiles(directory) {
    try {
        fs_1.default.readdir(directory, function (err, files) {
            if (err) {
                //log.error(err);
                console.log(err);
                return;
            }
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                logger_1.default.info("files from tmp dir " + files);
                if (fs_1.default.lstatSync(path_1.default.join(directory, file)).isFile()) {
                    fs_1.default.unlink(path_1.default.join(directory, file), function (err) {
                        if (err) {
                            //log.error(err);
                            console.log(err);
                            return;
                        }
                    });
                }
            }
            //log.info("temp files deleted");
            console.log("temp files deleted");
        });
    }
    catch (error) {
        //log.error(error);
        console.log(error);
    }
}
exports.cleanUpTempFiles = cleanUpTempFiles;
