import { PdfConverter } from "./pdfconverter-interface";
import libre from "libreoffice-convert";
import fsx from "fs";
import {promisify} from 'util';
import log from "../../logger/logger";
const fs = fsx.promises;

export class LibreOfficePdfConverter implements PdfConverter{
    async convert(pdfOptions){
        let inputPath = pdfOptions.inputFilePath;
        let outputPath = pdfOptions.outputFilePath;
        await this.convertFile(inputPath, outputPath);
    }

    async convertFile(input:string, output:string) {
        try {
            const file = await fs.readFile(input);
            const libconvert = promisify(libre.convert);
    
            const done = await libconvert(file, ".pdf", undefined);
            const proccessed = await fs.writeFile(output, done)
            log.info(`Successfully converted file to pdf ${proccessed}`);
            return 'Successfully converted file to pdf';
    
            
        } catch (error) {
            return error.message;
        }
    }
    
} 





