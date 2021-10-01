import { FileUploadService } from "./uploadservice";
import { ProviderService } from "./processed_provider";
import { cleanUpTempFiles } from "./cleantmpfiles";
import log from "../logger/logger";
import { google } from "googleapis";
import dotenv from "dotenv";
import { PdfOptions } from "./pdf-converter/pdfoptions";
import ImageProcessor from "./processimageservice";
import { cleanUpDownloadedImages } from "./cleandownloadedimages";
import { cleanUpExtractedFiles } from "./cleanextractedfiles";
import {GooglePdfConverter} from "./pdf-converter/google-pdf-promises";
dotenv.config();


const https = require("https");
var fs = require("fs");
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
var path = require("path");

const keyPath = path.join(__dirname, "../../credentials.json");
const scope =   ['https://www.googleapis.com/auth/drive'];
const parentFolder = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scope
});


export class DocumentService  {

    public async process(obj){
        try {
            const workingDir = `${process.env.WORKING_DIR}/downloads`; 
            const timestamp = Date.now();
            const filePath = `${workingDir}/temp2_${timestamp}.docx`;
            const tempfile = fs.createWriteStream(filePath);
            
            const fileToDownload = obj.file;
            await https.get(fileToDownload, response => {
                response.pipe(tempfile);
            });


            tempfile.on('finish', async () => {
                console.log('All writes are now complete.')
                var content = fs.readFileSync(filePath, "binary");
                var zip = new PizZip(content);
                var doc = new Docxtemplater(zip);

                console.log("obj.data =>> ",obj.data);

                doc.setData(obj.data);
                doc.render();
                var buf = doc.getZip().generate({ type: "nodebuffer" });
                fs.writeFileSync(path.resolve(workingDir, `tempfile_out_${timestamp}.docx`), buf);

                const docxOutputFilePath = path.resolve(workingDir, `tempfile_out_${timestamp}.docx`);
                const token = obj.token;

                if(obj.data["__images__"]){
                    let imageObj = obj.data["__images__"];
                    let imgDir = `${workingDir}/images`;
                    let fileSource = docxOutputFilePath;

                    let extractDestination = `${workingDir}/extract`;
                    let imageDestination =  `${extractDestination}/word/media`;

                    ImageProcessor.processFile(imageObj, imgDir, fileSource, extractDestination, imageDestination).then(()=>{
                        fs.readdir(extractDestination, async(err, files) => {
                            log.info(`here### , ${files}`)
                            if (err) {
                                log.error(err);
                                return;
                            }

                            let regex = /^processed_file_\d+\.docx$/;
                            const processedFile = files.find(file => file.match(regex));
                            log.info("processed file " + processedFile)
                            

                            if(!processedFile){
                                log.info("###processed file not found");
                                return;
                            }
                            
                            let processedFilePath = `${extractDestination}/${processedFile}`;

                            if(obj.outputType && obj.outputType.toLowerCase() === "pdf"){
                                let pdfFilePath = path.resolve(workingDir,`tempfile_out_${timestamp}.pdf`);
                                let pdfWritableStream = fs.createWriteStream(pdfFilePath);

                                let options = new PdfOptions();
                                options.auth = auth;
                                options.inputFilePath = processedFilePath;
                                options.outputFilePath = pdfWritableStream;
                                options.parentFolder = parentFolder;

                                let hasGeneratedPdf = await new GooglePdfConverter().convert(options);
                                log.info(`hasGenPdf  ${hasGeneratedPdf}`);

                                if(!hasGeneratedPdf){
                                    throw new Error("the pdf was not generated...")
                                }

                                if(hasGeneratedPdf){
                                    new FileUploadService().upload(pdfFilePath, token).then(url => {
                                        log.info(`the url from file manager ${ url}`)
                                        new ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId, obj.invoiceId);
                                        
                                        cleanUpTempFiles(workingDir);
                                        cleanUpDownloadedImages(imgDir);
                                        cleanUpExtractedFiles(extractDestination);
    
                                    }).catch((error)=>{
                                        log.error(error)
                                    })
    
                                    
                                    return;
                                }
                                
                            }
    
                            new FileUploadService().upload(processedFilePath, token).then(url => {
                                log.info("the url from file manager "+ url)
                                new ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId,obj.invoiceId);
                               
                                cleanUpDownloadedImages(imgDir);
                                cleanUpExtractedFiles(extractDestination);
                                cleanUpTempFiles(workingDir);

                            }).catch((error)=>{
                                log.error(error)
                            });
                            
                            
                        });
                    }).catch((error)=>{
                        log.error(error)
                        
                    }); // end of image_processor
                  
                    return;
                }; // end of __image__ logic

                const pdfFilePath = path.resolve(workingDir,`tempfile_out_${timestamp}.pdf`);
                console.log("pdf file path "+ pdfFilePath)
                const pdfWritableStream = fs.createWriteStream(pdfFilePath);

                if (obj.outputType && obj.outputType.toLowerCase() === "pdf") {
                    let options = new PdfOptions();

                    options.auth = auth;
                    options.inputFilePath = docxOutputFilePath;
                    options.outputFilePath = pdfWritableStream;
                    options.parentFolder = parentFolder;

                    let hasGeneratedPdf = await new GooglePdfConverter().convert(options);
                    console.log("hasGenPdf "+ hasGeneratedPdf)

                    if(!hasGeneratedPdf){
                        throw new Error("the pdf was not generated...")
                    }

                    if(hasGeneratedPdf){
                        new FileUploadService()
                        .upload(pdfFilePath, token)
                        .then((url) => {
                            console.log(`the url from file manager ${ url}`)
                            new ProviderService().pushToQueue(
                                obj.recordId,
                                url,
                                obj.fieldId,
                                obj.tenantId,
                                obj.invoiceId
                            );
                            cleanUpTempFiles(workingDir);
                            
                        }).catch((error)=>{
                            console.log(error)
                        });
                        return;
                    }

    

                } else {
                    new FileUploadService().upload(docxOutputFilePath, token).then(url => {
                        console.log("the url from file manager "+ url)
                        new ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId,obj.invoiceId);
                        cleanUpTempFiles(workingDir);
                    }).catch((error)=>{
                        console.log(error)
                        
                    })
                }
                
            })
            
            

            
        } catch (error) {
            log.error(error)
            //console.log(error)
        } 
    }

}
