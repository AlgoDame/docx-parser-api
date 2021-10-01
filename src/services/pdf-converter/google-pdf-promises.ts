import { PdfConverter } from "./pdfconverter-interface";
import { google } from "googleapis";
import fs from "fs";

export class GooglePdfConverter implements PdfConverter{
    public async convert(pdfOptions): Promise<boolean> { 
        let auth = pdfOptions.auth;
        let inputPath = pdfOptions.inputFilePath;
        let outputPath = pdfOptions.outputFilePath;
        let parentFolder = pdfOptions.parentFolder;

        try {
            
            let fileId = await this.uploadFileToDrive(auth, inputPath, parentFolder);

            if(fileId){

                let hasGenerated = await this.convertFile(auth, fileId, outputPath);

                if(hasGenerated){
                    return true
                }else{
                    return false
                }
            }


        } catch (error) {
            console.log(error)
        }
        

        
    }

    private uploadFileToDrive(auth:any,inputPath:string, parentFolder:string): Promise<string>{
        return new Promise(function(resolve, reject){

            const driveService = google.drive({
                version: "v3",
                auth: auth
            });

            let fileMetaData = {
                "name" : `awesome-file-${Date.now()}.docx`,
                "parents": [parentFolder],
                mimeType: 'application/vnd.google-apps.document'
            }
            let media = {
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                body: fs.createReadStream(inputPath)
            }

            driveService.files.create({
                requestBody: fileMetaData,
                media: media,
                fields: "id"
            }, (err, res)=>{
                if(err){
                    reject(err)
                    return
                }
                let fileId = res.data.id;
                resolve(fileId)
            });

            
        })
            

       
    }


    private async convertFile(auth:any, fileId:string, outputPath:any ): Promise<boolean> {
        return new Promise(function(resolve, reject){
            let convertStatus = false;

            const driveService = google.drive({
                version: "v3",
                auth: auth
            });

            driveService.files.export({
                fileId: fileId,
                mimeType: "application/pdf",
                
            }, {responseType: "stream"}, (err, response:any)=>{
            if(err){
                console.log(err)
                return;
            }
            response.data.on("error", (err: any) => {
                console.log(err)
                reject(err)
                return;

            }).on("end", async ()=>{
                convertStatus = true;
                console.log("pdf file generated from drive")
                await GooglePdfConverter.deleteFromDrive(auth,fileId)
                resolve(convertStatus)
            }).pipe(outputPath)
            })
        })
            
        
       
    }
    
    private static deleteFromDrive(auth:any, fileId:string): Promise<boolean>{
        return new Promise(async function (resolve, reject){
            let deleteStatus = false;

            const driveService = google.drive({
                version: "v3",
                auth: auth
            });

            let removedFile = await driveService.files.delete({
                fileId: fileId
            })

            if(removedFile?.status === 204){
                deleteStatus = true
                console.log("file deleted from drive")
                resolve(deleteStatus)
            }else{
                reject(new Error("file not deleted from drive"))
            }
            
        })
        
    }

} 


















       
