"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
var uploadservice_1 = require("./uploadservice");
var processed_provider_1 = require("./processed_provider");
var cleantmpfiles_1 = require("./cleantmpfiles");
var logger_1 = __importDefault(require("../logger/logger"));
var googleapis_1 = require("googleapis");
var dotenv_1 = __importDefault(require("dotenv"));
var pdfoptions_1 = require("./pdf-converter/pdfoptions");
var processimageservice_1 = __importDefault(require("./processimageservice"));
var cleandownloadedimages_1 = require("./cleandownloadedimages");
var cleanextractedfiles_1 = require("./cleanextractedfiles");
var google_pdf_promises_1 = require("./pdf-converter/google-pdf-promises");
dotenv_1.default.config();
var https = require("https");
var fs = require("fs");
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
var path = require("path");
var keyPath = path.join(__dirname, "../../credentials.json");
var scope = ['https://www.googleapis.com/auth/drive'];
var parentFolder = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
var auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scope
});
var DocumentService = /** @class */ (function () {
    function DocumentService() {
    }
    DocumentService.prototype.process = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var workingDir_1, timestamp_1, filePath_1, tempfile_1, fileToDownload, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        workingDir_1 = process.env.WORKING_DIR + "/downloads";
                        timestamp_1 = Date.now();
                        filePath_1 = workingDir_1 + "/temp2_" + timestamp_1 + ".docx";
                        tempfile_1 = fs.createWriteStream(filePath_1);
                        fileToDownload = obj.file;
                        return [4 /*yield*/, https.get(fileToDownload, function (response) {
                                response.pipe(tempfile_1);
                            })];
                    case 1:
                        _a.sent();
                        tempfile_1.on('finish', function () { return __awaiter(_this, void 0, void 0, function () {
                            var content, zip, doc, buf, docxOutputFilePath, token, imageObj, imgDir_1, fileSource, extractDestination_1, imageDestination, pdfFilePath, pdfWritableStream, options, hasGeneratedPdf;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        //log.info('All writes are now complete.');
                                        console.log('All writes are now complete.');
                                        content = fs.readFileSync(filePath_1, "binary");
                                        zip = new PizZip(content);
                                        doc = new Docxtemplater(zip);
                                        console.log("obj.data =>> ", obj.data);
                                        doc.setData(obj.data);
                                        doc.render();
                                        buf = doc.getZip().generate({ type: "nodebuffer" });
                                        fs.writeFileSync(path.resolve(workingDir_1, "tempfile_out_" + timestamp_1 + ".docx"), buf);
                                        docxOutputFilePath = path.resolve(workingDir_1, "tempfile_out_" + timestamp_1 + ".docx");
                                        token = obj.token;
                                        if (obj.data["__images__"]) {
                                            imageObj = obj.data["__images__"];
                                            imgDir_1 = workingDir_1 + "/images";
                                            fileSource = docxOutputFilePath;
                                            extractDestination_1 = workingDir_1 + "/extract";
                                            imageDestination = extractDestination_1 + "/word/media";
                                            processimageservice_1.default.processFile(imageObj, imgDir_1, fileSource, extractDestination_1, imageDestination).then(function () {
                                                fs.readdir(extractDestination_1, function (err, files) { return __awaiter(_this, void 0, void 0, function () {
                                                    var regex, processedFile, processedFilePath, pdfFilePath_1, pdfWritableStream_1, options, hasGeneratedPdf;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                logger_1.default.info("here### , " + files);
                                                                if (err) {
                                                                    logger_1.default.error(err);
                                                                    return [2 /*return*/];
                                                                }
                                                                regex = /^processed_file_\d+\.docx$/;
                                                                processedFile = files.find(function (file) { return file.match(regex); });
                                                                logger_1.default.info("processed file " + processedFile);
                                                                if (!processedFile) {
                                                                    logger_1.default.info("###processed file not found");
                                                                    return [2 /*return*/];
                                                                }
                                                                processedFilePath = extractDestination_1 + "/" + processedFile;
                                                                if (!(obj.outputType && obj.outputType.toLowerCase() === "pdf")) return [3 /*break*/, 2];
                                                                pdfFilePath_1 = path.resolve(workingDir_1, "tempfile_out_" + timestamp_1 + ".pdf");
                                                                pdfWritableStream_1 = fs.createWriteStream(pdfFilePath_1);
                                                                options = new pdfoptions_1.PdfOptions();
                                                                options.auth = auth;
                                                                options.inputFilePath = processedFilePath;
                                                                options.outputFilePath = pdfWritableStream_1;
                                                                options.parentFolder = parentFolder;
                                                                return [4 /*yield*/, new google_pdf_promises_1.GooglePdfConverter().convert(options)];
                                                            case 1:
                                                                hasGeneratedPdf = _a.sent();
                                                                logger_1.default.info("hasGenPdf  " + hasGeneratedPdf);
                                                                if (!hasGeneratedPdf) {
                                                                    throw new Error("the pdf was not generated...");
                                                                }
                                                                if (hasGeneratedPdf) {
                                                                    new uploadservice_1.FileUploadService().upload(pdfFilePath_1, token).then(function (url) {
                                                                        logger_1.default.info("the url from file manager " + url);
                                                                        new processed_provider_1.ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId, obj.invoiceId);
                                                                        cleantmpfiles_1.cleanUpTempFiles(workingDir_1);
                                                                        cleandownloadedimages_1.cleanUpDownloadedImages(imgDir_1);
                                                                        cleanextractedfiles_1.cleanUpExtractedFiles(extractDestination_1);
                                                                    }).catch(function (error) {
                                                                        logger_1.default.error(error);
                                                                    });
                                                                    return [2 /*return*/];
                                                                }
                                                                _a.label = 2;
                                                            case 2:
                                                                new uploadservice_1.FileUploadService().upload(processedFilePath, token).then(function (url) {
                                                                    logger_1.default.info("the url from file manager " + url);
                                                                    new processed_provider_1.ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId, obj.invoiceId);
                                                                    cleandownloadedimages_1.cleanUpDownloadedImages(imgDir_1);
                                                                    cleanextractedfiles_1.cleanUpExtractedFiles(extractDestination_1);
                                                                    cleantmpfiles_1.cleanUpTempFiles(workingDir_1);
                                                                }).catch(function (error) {
                                                                    logger_1.default.error(error);
                                                                });
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); });
                                            }).catch(function (error) {
                                                logger_1.default.error(error);
                                            }); // end of image_processor
                                            return [2 /*return*/];
                                        }
                                        ; // end of __image__ logic
                                        pdfFilePath = path.resolve(workingDir_1, "tempfile_out_" + timestamp_1 + ".pdf");
                                        //log.info("pdf file path "+ pdfFilePath)
                                        console.log("pdf file path " + pdfFilePath);
                                        pdfWritableStream = fs.createWriteStream(pdfFilePath);
                                        if (!(obj.outputType && obj.outputType.toLowerCase() === "pdf")) return [3 /*break*/, 2];
                                        options = new pdfoptions_1.PdfOptions();
                                        options.auth = auth;
                                        options.inputFilePath = docxOutputFilePath;
                                        options.outputFilePath = pdfWritableStream;
                                        options.parentFolder = parentFolder;
                                        return [4 /*yield*/, new google_pdf_promises_1.GooglePdfConverter().convert(options)];
                                    case 1:
                                        hasGeneratedPdf = _a.sent();
                                        //log.info("hasGenPdf "+ hasGeneratedPdf);
                                        console.log("hasGenPdf " + hasGeneratedPdf);
                                        if (!hasGeneratedPdf) {
                                            throw new Error("the pdf was not generated...");
                                        }
                                        if (hasGeneratedPdf) {
                                            new uploadservice_1.FileUploadService()
                                                .upload(pdfFilePath, token)
                                                .then(function (url) {
                                                //log.info(`the url from file manager ${ url}`)
                                                console.log("the url from file manager " + url);
                                                new processed_provider_1.ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId, obj.invoiceId);
                                                cleantmpfiles_1.cleanUpTempFiles(workingDir_1);
                                            }).catch(function (error) {
                                                //log.error(error)
                                                console.log(error);
                                            });
                                            return [2 /*return*/];
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        new uploadservice_1.FileUploadService().upload(docxOutputFilePath, token).then(function (url) {
                                            //log.info("the url from file manager "+ url)
                                            console.log("the url from file manager " + url);
                                            new processed_provider_1.ProviderService().pushToQueue(obj.recordId, url, obj.fieldId, obj.tenantId, obj.invoiceId);
                                            cleantmpfiles_1.cleanUpTempFiles(workingDir_1);
                                        }).catch(function (error) {
                                            //log.error(error)
                                            console.log(error);
                                        });
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.default.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DocumentService;
}());
exports.DocumentService = DocumentService;
