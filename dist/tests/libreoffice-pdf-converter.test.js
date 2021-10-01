"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var pdfoptions_1 = require("../services/pdf-converter/pdfoptions");
var libreofficepdfconverter_1 = require("../services/pdf-converter/libreofficepdfconverter");
dotenv_1.default.config();
var workingDir = process.env.TMP_UPLOAD_DIR;
var docxInputFilePath = path_1.default.resolve(workingDir, "offer-table.docx");
var pdfFilePath = path_1.default.resolve(workingDir, "output_offer-table_" + Date.now() + ".pdf");
var options = new pdfoptions_1.PdfOptions();
options.inputFilePath = docxInputFilePath;
options.outputFilePath = pdfFilePath;
var outputFile = pdfFilePath.slice(15);
describe("Convert docx to pdf with Libre-office converter", function () {
    this.timeout(6000);
    it("libre-office should create a valid pdf file", function (done) {
        new libreofficepdfconverter_1.LibreOfficePdfConverter().convert(options).then(function () {
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
