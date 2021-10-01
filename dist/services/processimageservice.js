"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var unzipper_1 = __importDefault(require("unzipper"));
var https_1 = __importDefault(require("https"));
var logger_1 = __importDefault(require("../logger/logger"));
var zipper = require("zip-local");
var ImageProcessor = {
    downloadImages: function (imageObj, imgDirectory) {
        return new Promise(function (resolve, reject) {
            var downloadLinksArr = Object.values(imageObj);
            var count = 0;
            var arrLen = downloadLinksArr.length;
            downloadLinksArr.forEach(function (link, index) {
                var linkKey = Object.keys(imageObj).find(function (key) { return imageObj[key] === link; });
                if (!linkKey) {
                    throw new Error("No matching key found for link");
                }
                var imageName = linkKey.replace("image_", "");
                var imagePath = imgDirectory + "/" + imageName;
                var imgWritableStream = fs_1.default.createWriteStream(imagePath);
                https_1.default.get(link, function (response) {
                    response.pipe(imgWritableStream)
                        .on("close", function () {
                        logger_1.default.info("downloaded image " + (index + 1));
                        count = count + 1;
                        if (count === arrLen) {
                            resolve(true);
                        }
                    })
                        .on("error", function (err) {
                        logger_1.default.info("image download failure " + err.message);
                        reject(err);
                    });
                });
            });
        });
    },
    unzipFile: function (imageObj, imgDirectory, fileSourcePath, extractDestinationPath, imageDestination) {
        return new Promise(function (resolve, reject) {
            ImageProcessor.downloadImages(imageObj, imgDirectory).then(function () {
                fs_1.default.createReadStream(fileSourcePath)
                    .pipe(unzipper_1.default.Extract({ path: extractDestinationPath }))
                    .on("error", function () {
                    logger_1.default.error(Error);
                    reject(Error);
                })
                    .on("close", function () {
                    logger_1.default.info("Done extracting");
                    var imageCount = 0;
                    fs_1.default.readdir(imgDirectory, function (err, files) {
                        if (err) {
                            logger_1.default.error(err);
                            return;
                        }
                        ;
                        if (!files) {
                            logger_1.default.info("No image files found in directory");
                            return;
                        }
                        ;
                        logger_1.default.info("images " + files);
                        var imgArrLen = files.length;
                        files.forEach(function (image) {
                            var imagePath = imgDirectory + "/" + image;
                            var imageDestPath = imageDestination + "/" + image;
                            fs_1.default.copyFile(imagePath, imageDestPath, function (err) {
                                if (err) {
                                    logger_1.default.info("failed to copy " + err);
                                    return err;
                                }
                                logger_1.default.info('source file was copied to destination file');
                                imageCount = imageCount + 1;
                                if (imageCount === imgArrLen) {
                                    resolve(true);
                                }
                            });
                        });
                    });
                });
            });
        }); // end of promise
    },
    processFile: function (imageObj, imgDirectory, fileSourcePath, extractDestinationPath, imageDestination) {
        return new Promise(function (resolve, reject) {
            ImageProcessor.unzipFile(imageObj, imgDirectory, fileSourcePath, extractDestinationPath, imageDestination).then(function () {
                zipper.zip(extractDestinationPath, function (error, zipped) {
                    if (error) {
                        logger_1.default.error(error);
                        return;
                    }
                    ;
                    zipped.compress();
                    var timeStamp = Date.now();
                    var file = extractDestinationPath + "/processed_file_" + timeStamp + ".docx";
                    zipped.save(file, function (error) {
                        if (error) {
                            logger_1.default.error(error);
                            reject(error);
                            return;
                        }
                        logger_1.default.info("processed file saved successfully !");
                        resolve(true);
                    });
                });
            });
        });
    }
};
exports.default = ImageProcessor;
