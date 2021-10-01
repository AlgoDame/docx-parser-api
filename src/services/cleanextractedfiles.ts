import fs from "fs";
import path from "path";
import log from "../logger/logger";


export function cleanUpExtractedFiles(directory:string) {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                log.error(err);
                return;
            }

            log.info(`deleting extracted files ${files}`)

            for (const file of files) {
                if(fs.lstatSync(path.join(directory, file)).isFile()){
                    fs.unlink(path.join(directory, file), (err) => {
                        if (err) {
                            log.error(err);
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

            log.info("extracted files deleted");
        });

    } catch (error) {
        log.error(error);
    }
}