import fs from "fs";
import path from "path";
import log from "../logger/logger";


export function cleanUpDownloadedImages(directory) {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                log.error(err);
                return;
            }

            log.info(`deleting downloaded images  ${files}`)

            for (const file of files) {
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) {
                        log.error(err);
                        return;
                    }
                });
            }
            log.info("downloaded images deleted");
        });
    } catch (error) {
        log.error(error);
      
    }
}

