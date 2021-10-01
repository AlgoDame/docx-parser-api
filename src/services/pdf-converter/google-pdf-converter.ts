import { PdfConverter } from "./pdfconverter-interface";
import { google } from "googleapis";
import fs from "fs";
import log from "../../logger/logger";

export class GooglePdfConverter implements PdfConverter{
    async convert(pdfOptions){
        let auth = pdfOptions.auth;
        let inputPath = pdfOptions.inputFilePath;
        let outputPath = pdfOptions.outputFilePath;
        let parentFolder = pdfOptions.parentFolder;
        let fileId;

        fileId = await this.uploadFileToDrive(auth,inputPath, parentFolder);
        log.info(`converter class: file id ${ fileId}`)

        if(fileId){
            await this.convertFile(auth, fileId, outputPath);
            log.info("after converting file")
            const removeFileResponse = await this.deleteFromDrive(auth, fileId);
            
            if(removeFileResponse?.status === 204){
                log.info(`Successfully deleted file: status is ${removeFileResponse.status}`)
            }
        }
    }

    private async uploadFileToDrive(auth:any,inputPath:string, parentFolder:string){
        try {
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

            let response = await driveService.files.create({
                requestBody: fileMetaData,
                media: media,
                fields: "id"
            });

        if(response.data){
            log.info(`file id: ${response.data.id}`)
            return response.data.id
        }

        } catch (error) {
            log.error(error)
        }
    }

    private async convertFile(auth:any, fileId:string, outputPath:any ) {
        try {
            const driveService = google.drive({
                version: "v3",
                auth: auth
            });

            let exportFile =  await driveService.files.export({
                fileId: fileId,
                mimeType: "application/pdf",
                
            }, {responseType: "stream"}, (err, response:any)=>{
            if(err){
                log.error(err)
                return;
            }
            response.data.on("error", (err: any) => {
                log.error(err)
                return
            }).on("end", ()=>{
                log.error("done converting file to pdf")
            }).pipe(outputPath)
        })
        
        
        } catch (error) {
            log.error(error)
        }
    }
    
    private async deleteFromDrive(auth:any, fileId:string){
        try {
            const driveService = google.drive({
                version: "v3",
                auth: auth
            });

            let removedFile = await driveService.files.delete({
                fileId: fileId
            })
            log.info(`the removed google doc file , ${removedFile}`)
            return removedFile;
            

        } catch (error) {
            log.error(error)
        }
    }

} 


















       
