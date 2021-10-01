import {expect} from "chai";
import mocha from "mocha";
import dotenv from "dotenv";
import { GooglePdfConverter } from "../services/pdf-converter/google-pdf-converter";
import { PdfOptions } from "../services/pdf-converter/pdfoptions";
import { google } from "googleapis";
import path from "path";
import fs from "fs";


dotenv.config();

const keyPath = path.join(__dirname, "../../auth.json");
const scope =   ['https://www.googleapis.com/auth/drive'];
const parentFolder = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scope
});

const workingDir = process.env.TMP_UPLOAD_DIR;
const docxInputFilePath = path.resolve(workingDir, `offer-table.docx`);
const pdfFilePath = path.resolve(workingDir,`output_offer-table_${Date.now()}.pdf`);
const outputFile =  pdfFilePath.slice(15);
const pdfWritableStream = fs.createWriteStream(pdfFilePath);

let options = new PdfOptions();
options.auth = auth;
options.inputFilePath = docxInputFilePath;
options.outputFilePath = pdfWritableStream;
options.parentFolder = parentFolder;


describe("Convert docx to pdf with Google API", function() {
    this.timeout(6000);
    it("Google API should create a valid pdf file", function(done) {
        new GooglePdfConverter().convert(options).then(()=>{
            fs.readdir(workingDir, (err, files) => {
                if(err){
                    console.error(err.message);
                }
               
                const result = files.filter(file => file === outputFile);
                expect(result[0]).to.equal(outputFile);
                done();
                
            });
        })
       
         
        
    })
    
})

