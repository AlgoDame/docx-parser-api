import fs from "fs";
import path from "path";
import log from "../logger/logger";


export function cleanUpScanFiles(directory) {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.log(err)
                return;
            }

            console.log(`scan files to delete  ${files}`)

            for (const file of files) {
                console.log("files from scan dir "+ files)
                if(fs.lstatSync(path.join(directory, file)).isFile()){
                    fs.unlink(path.join(directory, file), (err) => {
                        if (err) {
                            console.log(err)
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

            console.log("scan files deleted")
        });

    } catch (error) {
        console.log(error)
    }
}

