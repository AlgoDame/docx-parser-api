import fs from "fs";
import unzipper from "unzipper";
import log from "../logger/logger";

export let getImagePlaceholders = {
    extract: function (filePath: string, extractDestination: string): Promise<Record<string, any>> {
        return new Promise(function (resolve, reject) {
            fs.createReadStream(filePath)
                .pipe(unzipper.Extract({ path: extractDestination }))
                .on("error", () => {
                    log.error(Error);
                    reject(Error)
                })
                .on("close", () => {
                    let imgDir = `${extractDestination}/word/media`;
                    if (fs.existsSync(imgDir)) {
                        fs.readdir(imgDir, (err, files) => {
                            if (err) {
                                log.error(err);
                                return;
                            };

                            if (!files) {
                                log.info("No image placeholders found in directory");
                                return;
                            };
                            let responseObj = { images: files }
                            resolve(responseObj);
                            return responseObj;
                        })
                        return;
                    }

                    if (!fs.existsSync(imgDir)) {
                        let responseObj = { images: null }
                        resolve(responseObj);
                        return responseObj;
                    }



                })
        })
    }
}
