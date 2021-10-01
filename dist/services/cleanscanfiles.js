"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpScanFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function cleanUpScanFiles(directory) {
    try {
        fs_1.default.readdir(directory, function (err, files) {
            if (err) {
                //log.error(err);
                console.log(err);
                return;
            }
            //log.info(`scan files to delete  ${files}`)
            console.log("scan files to delete  " + files);
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                //log.info("files from scan dir "+ files)
                console.log("files from scan dir " + files);
                if (fs_1.default.lstatSync(path_1.default.join(directory, file)).isFile()) {
                    fs_1.default.unlink(path_1.default.join(directory, file), function (err) {
                        if (err) {
                            //log.error(err);
                            console.log(err);
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
            //log.info("scan files deleted");
            console.log("scan files deleted");
        });
    }
    catch (error) {
        //log.error(error);
        console.log(error);
    }
}
exports.cleanUpScanFiles = cleanUpScanFiles;
