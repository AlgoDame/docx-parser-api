"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
dotenv_1.default.config();
var DirMaker = /** @class */ (function () {
    function DirMaker() {
    }
    DirMaker.prototype.makeDownloadsDir = function (workingDir) {
        var downloadsDir = path_1.default.resolve(workingDir, "downloads");
        fs_1.default.access(downloadsDir, function (error) {
            if (error) {
                fs_1.default.mkdir(downloadsDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err);
                    }
                    else {
                        //log.info(`${downloadsDir}: Directory successfully created.`)
                        console.log(downloadsDir + ": Directory successfully created.");
                    }
                });
            }
            else {
                //log.info(`${downloadsDir}: Directory already exists.`)
                console.log(downloadsDir + ": Directory already exists.");
            }
        });
    };
    DirMaker.prototype.makeScanDir = function (workingDir) {
        var scanDir = path_1.default.resolve(workingDir, "downloads", "scan");
        fs_1.default.access(scanDir, function (error) {
            if (error) {
                fs_1.default.mkdir(scanDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err);
                    }
                    else {
                        //log.info(`${scanDir}: Directory successfully created.`)
                        console.log(scanDir + ": Directory successfully created.");
                    }
                });
            }
            else {
                //log.info(`${scanDir}: Directory already exists.`)
                console.log(scanDir + ": Directory already exists.");
            }
        });
    };
    DirMaker.prototype.makeDownloadedImageDir = function (workingDir) {
        var downloadedImageDir = path_1.default.resolve(workingDir, "downloads", "images");
        fs_1.default.access(downloadedImageDir, function (error) {
            if (error) {
                fs_1.default.mkdir(downloadedImageDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err);
                    }
                    else {
                        //log.info(`${downloadedImageDir}: Directory successfully created.`)
                        console.log(downloadedImageDir + ": Directory successfully created.");
                    }
                });
            }
            else {
                //log.info(`${downloadedImageDir}: Directory already exists.`)
                console.log(downloadedImageDir + ": Directory already exists.");
            }
        });
    };
    DirMaker.prototype.makeExtractDir = function (workingDir) {
        var extractDir = path_1.default.resolve(workingDir, "downloads", "extract");
        fs_1.default.access(extractDir, function (error) {
            if (error) {
                fs_1.default.mkdir(extractDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err);
                    }
                    else {
                        //log.info(`${extractDir}: Directory successfully created.`)
                        console.log(extractDir + ": Directory successfully created.");
                    }
                });
            }
            else {
                //log.info(`${extractDir}: Directory already exists.`)
                console.log(extractDir + ": Directory already exists.");
            }
        });
    };
    DirMaker.prototype.makeImageExtractDir = function (workingDir) {
        var imageExtractDir = path_1.default.resolve(workingDir, "downloads", "image-extract");
        fs_1.default.access(imageExtractDir, function (error) {
            if (error) {
                fs_1.default.mkdir(imageExtractDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err);
                    }
                    else {
                        //log.info(`${imageExtractDir}: Directory successfully created.`)
                        console.log(imageExtractDir + ": Directory successfully created.");
                    }
                });
            }
            else {
                //log.info(`${imageExtractDir}: Directory already exists.`)
                console.log(imageExtractDir + ": Directory already exists.");
            }
        });
    };
    DirMaker.prototype.createDirectories = function (workingDir) {
        this.makeDownloadsDir(workingDir);
        this.makeScanDir(workingDir);
        this.makeDownloadedImageDir(workingDir);
        this.makeExtractDir(workingDir);
        this.makeImageExtractDir(workingDir);
    };
    return DirMaker;
}());
exports.default = DirMaker;
