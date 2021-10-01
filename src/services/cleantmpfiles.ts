import fs from "fs";
import path from "path";
import log from "../logger/logger";


export function cleanUpTempFiles(directory) {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.log(err);
                return;
            }

            for (const file of files) {
                log.info("files from tmp dir "+ files)
                if(fs.lstatSync(path.join(directory, file)).isFile()){
                    fs.unlink(path.join(directory, file), (err) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                    });
                }
               
            }
            console.log("temp files deleted");
        });
    } catch (error) {
        console.log(error)
    }
}

