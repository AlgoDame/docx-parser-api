import {Request, Response} from "express";
import fs from "fs";
import parseDoc from "./documentparser";
import dotenv from "dotenv";
import https from "https";
import isUrl from  "is-url";
import isValidFile from "../utils/filevalidator";
import { cleanUpScanFiles } from "./cleanscanfiles";
import log from "../logger/logger";
import { getImagePlaceholders } from "./imageplaceholder-service";
import { cleanUpImageFiles } from "./cleanimgextractfiles";
dotenv.config()

const imgExtractDestination = `${process.env.WORKING_DIR}/downloads/image-extract`;

export class PlaceholderService {

     public async scan(req:Request, res:Response){
        try {
            if(!req.body.url){
                return res.status(400).json({
                    status: "Error",
                    message: "No url provided"
                })
            }

            const url = req.body.url;
            const isValid = isUrl(url);
            if(!isValid){
                return res.status(404).json({
                    status: "Error",
                    message: "Please provide a valid url"
                })
            }
            
            const fileValidity = await isValidFile(url);
            if(fileValidity.ext !== "docx"){
                return res.status(400).json({
                    status: "Error",
                    message: "Only docx file is supported for this operation"
                })
            }

            const fileToDownload = url;  
            const workingDir = `${process.env.WORKING_DIR}/downloads/scan`;
            const timestamp = Date.now();
            const filePath = `${workingDir}/scan_file_${timestamp}.docx`;
            const scanfile = fs.createWriteStream(filePath);
            
            
            await https.get(fileToDownload, response => {
                response.pipe(scanfile);
            });
        
            scanfile.on('finish', async ()=>{
                log.info("done writing to file")
                const placeholders = await parseDoc(filePath);
                let imagePlaceholders = getImagePlaceholders.extract(filePath, imgExtractDestination).then((responseObj)=>{
                    let images = responseObj.images;
                    if(placeholders === null && !images){
                        return res.status(204).json({})
                    }
                    if(placeholders || images){
                        cleanUpScanFiles(workingDir);
                        cleanUpImageFiles(imgExtractDestination);
                        return res.status(200).json({
                            status: "Success",
                            placeholders: placeholders,
                            imagePlaceholders: images
                        })
                    }
                });
               
            });
                
            

        } catch (error) {
            return res.status(400).json({
                status: "Error",
                Error: error.message
            })
        }
            
    }
        
}
        

    


