import fs from "fs";
import path from "path";
import log from "../logger/logger";


export function cleanUpImageFiles(directory) {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                log.error(err);
                return;
            }

            log.info(`deleting image-extract folder content ${files}`)

            for (const file of files) {
                if(fs.lstatSync(path.join(directory, file)).isFile()){
                    fs.unlink(path.join(directory, file), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }

                if(fs.lstatSync(path.join(directory, file)).isDirectory()){
                    fs.rmdir(path.join(directory, file), { recursive: true }, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            
            log.info("image-extract files deleted");
        });
    } catch (error) {
        log.error(error);
    }
}

