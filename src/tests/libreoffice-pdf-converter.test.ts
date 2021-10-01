import {expect} from "chai";
import mocha from "mocha";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { PdfOptions } from "../services/pdf-converter/pdfoptions";
import { LibreOfficePdfConverter } from "../services/pdf-converter/libreofficepdfconverter";

dotenv.config();

const workingDir = process.env.TMP_UPLOAD_DIR;
const docxInputFilePath = path.resolve(workingDir, `offer-table.docx`);
const pdfFilePath = path.resolve(workingDir,`output_offer-table_${Date.now()}.pdf`);
let options = new PdfOptions();

options.inputFilePath = docxInputFilePath;
options.outputFilePath = pdfFilePath;
const outputFile =  pdfFilePath.slice(15);


describe("Convert docx to pdf with Libre-office converter", function() {
    this.timeout(6000);
    it("libre-office should create a valid pdf file", function(done) {
        new LibreOfficePdfConverter().convert(options).then(()=>{
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