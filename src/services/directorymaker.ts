import dotenv from "dotenv";
import fs from "fs";
import log from "../logger/logger";
import path from "path";
dotenv.config();



export default class DirMaker {
    private makeDownloadsDir(workingDir: string) {
        const downloadsDir = path.resolve(workingDir, "downloads")

        fs.access(downloadsDir, function (error) {
            if (error) {
                fs.mkdir(downloadsDir, { recursive: true }, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(`${downloadsDir}: Directory successfully created.`)
                    }
                })
            } else {
                console.log(`${downloadsDir}: Directory already exists.`)

            }
        })


    }

    private makeScanDir(workingDir: string) {
        const scanDir = path.resolve(workingDir, "downloads", "scan");

        fs.access(scanDir, function (error) {
            if (error) {
                fs.mkdir(scanDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err)
                    } else {
                        //log.info(`${scanDir}: Directory successfully created.`)
                        console.log(`${scanDir}: Directory successfully created.`)
                    }
                })
            } else {
                //log.info(`${scanDir}: Directory already exists.`)
                console.log(`${scanDir}: Directory already exists.`)

            }
        })

        
    }

    private makeDownloadedImageDir(workingDir: string) {
        const downloadedImageDir = path.resolve(workingDir, "downloads", "images");

        fs.access(downloadedImageDir, function (error) {
            if (error) {
                fs.mkdir(downloadedImageDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err)
                    } else {
                        //log.info(`${downloadedImageDir}: Directory successfully created.`)
                        console.log(`${downloadedImageDir}: Directory successfully created.`)
                    }
                })
            } else {
                //log.info(`${downloadedImageDir}: Directory already exists.`)
                console.log(`${downloadedImageDir}: Directory already exists.`)

            }
        })


    }

    private makeExtractDir(workingDir: string) {
        const extractDir = path.resolve(workingDir, "downloads", "extract");

        fs.access(extractDir, function (error) {
            if (error) {
                fs.mkdir(extractDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err)
                    } else {
                        //log.info(`${extractDir}: Directory successfully created.`)
                        console.log(`${extractDir}: Directory successfully created.`)
                    }
                })
            } else {
                //log.info(`${extractDir}: Directory already exists.`)
                console.log(`${extractDir}: Directory already exists.`)

            }
        })


    }

    private makeImageExtractDir(workingDir: string) {
        const imageExtractDir = path.resolve(workingDir, "downloads", "image-extract");

        fs.access(imageExtractDir, function (error) {
            if (error) {
                fs.mkdir(imageExtractDir, { recursive: true }, function (err) {
                    if (err) {
                        //log.info(err)
                        console.log(err)
                    } else {
                        //log.info(`${imageExtractDir}: Directory successfully created.`)
                        console.log(`${imageExtractDir}: Directory successfully created.`)
                    }
                })
            } else {
                //log.info(`${imageExtractDir}: Directory already exists.`)
                console.log(`${imageExtractDir}: Directory already exists.`)

            }
        })


    }

    public createDirectories(workingDir: string) {
        this.makeDownloadsDir(workingDir);
        this.makeScanDir(workingDir);
        this.makeDownloadedImageDir(workingDir);
        this.makeExtractDir(workingDir);
        this.makeImageExtractDir(workingDir);
    }
}