"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv_1 = __importDefault(require("dotenv"));
var google_pdf_converter_1 = require("../services/pdf-converter/google-pdf-converter");
var pdfoptions_1 = require("../services/pdf-converter/pdfoptions");
var googleapis_1 = require("googleapis");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
var keyPath = path_1.default.join(__dirname, "../../auth.json");
var scope = ['https://www.googleapis.com/auth/drive'];
var parentFolder = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
var auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scope
});
var workingDir = process.env.TMP_UPLOAD_DIR;
var docxInputFilePath = path_1.default.resolve(workingDir, "offer-table.docx");
var pdfFilePath = path_1.default.resolve(workingDir, "output_offer-table_" + Date.now() + ".pdf");
var outputFile = pdfFilePath.slice(15);
var pdfWritableStream = fs_1.default.createWriteStream(pdfFilePath);
var options = new pdfoptions_1.PdfOptions();
options.auth = auth;
options.inputFilePath = docxInputFilePath;
options.outputFilePath = pdfWritableStream;
options.parentFolder = parentFolder;
describe("Convert docx to pdf with Google API", function () {
    this.timeout(6000);
    it("Google API should create a valid pdf file", function (done) {
        new google_pdf_converter_1.GooglePdfConverter().convert(options).then(function () {
            fs_1.default.readdir(workingDir, function (err, files) {
                if (err) {
                    console.error(err.message);
                }
                var result = files.filter(function (file) { return file === outputFile; });
                chai_1.expect(result[0]).to.equal(outputFile);
                done();
            });
        });
    });
});
