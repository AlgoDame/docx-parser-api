import fs from "fs";
import unzipper from "unzipper"; 
import https from "https";
import log from "../logger/logger";
const zipper = require("zip-local");



let ImageProcessor = {

    downloadImages: function(imageObj: Record<string, any>, imgDirectory: string): Promise<boolean>{
        return new Promise(function (resolve, reject) {
            let downloadLinksArr = Object.values(imageObj);
            let count = 0;
            let arrLen = downloadLinksArr.length;
            downloadLinksArr.forEach((link, index) => {
                let linkKey = Object.keys(imageObj).find(key => imageObj[key] === link);

                if (!linkKey) {
                    throw new Error("No matching key found for link");
                }
                    
                let imageName = linkKey.replace("image_", "");

                const imagePath = `${imgDirectory}/${imageName}`;

                const imgWritableStream = fs.createWriteStream(imagePath);  


                https.get(link, response => {
                    response.pipe(imgWritableStream)
                    .on("close", () => {
                        log.info(`downloaded image ${index+1}`)
                        count = count + 1
                        if(count === arrLen){
                            resolve(true);
                        }
                    })
                    .on("error", (err) => {
                        log.info("image download failure " + err.message);
                        reject(err);
                        
                    })

                });
            
                
               
            });
            
            
            
        });
    },

    unzipFile: function (imageObj: Record<string, any>, imgDirectory: string, fileSourcePath: string, extractDestinationPath: string, imageDestination: string):Promise<boolean> {
        return new Promise(function (resolve, reject) {
            ImageProcessor.downloadImages(imageObj, imgDirectory).then(()=>{
                fs.createReadStream(fileSourcePath)
                .pipe(unzipper.Extract({ path: extractDestinationPath }))
                .on("error", () => {
                    log.error(Error);
                    reject(Error);
                })
                .on("close", () => {
                    log.info("Done extracting");
                    let imageCount = 0
                    fs.readdir(imgDirectory, (err, files) => {
                        if (err) {
                            log.error(err);
                            return;
                        };
    
                        if(!files){
                            log.info("No image files found in directory");
                            return;
                        };
    
                        log.info("images " + files)
                        let imgArrLen = files.length;
                        files.forEach(image => {
                            let imagePath = `${imgDirectory}/${image}`;
                            let imageDestPath = `${imageDestination}/${image}`;
                            fs.copyFile(imagePath, imageDestPath, (err: any) => {
                                if (err) {
                                    log.info("failed to copy " +  err)
                                    return err;
                                }

                                log.info('source file was copied to destination file');

                                imageCount = imageCount + 1;

                                if(imageCount === imgArrLen){
                                    resolve(true);
                                }
                                
                            
                            });
                
                        });
                        
                    });
                });
    
            });
        }); // end of promise
        
        
    },

    processFile: function(imageObj: Record<string, any>, imgDirectory: string, fileSourcePath: string, extractDestinationPath: string, imageDestination: string): Promise<boolean>{
        return new Promise(function(resolve, reject){
            ImageProcessor.unzipFile(imageObj, imgDirectory, fileSourcePath, extractDestinationPath, imageDestination).then(()=>{
                zipper.zip(extractDestinationPath, function(error:any, zipped:any){
                    if(error){
                        log.error(error);
                        return;
                    };
                    zipped.compress();
                    let timeStamp = Date.now();
                    let file = `${extractDestinationPath}/processed_file_${timeStamp}.docx`;
                    zipped.save(file, function(error:any) {
                        if(error){
                            log.error(error);
                            reject(error);
                            return;
                        }
                        
                        log.info("processed file saved successfully !");
                        resolve(true);
                       
                    });
                });
                
            })
        })
    }


};

export default ImageProcessor;
