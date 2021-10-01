"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var winston_logzio_1 = __importDefault(require("winston-logzio"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    LoggerService.info = function (info) {
        LoggerService.logger.info(info);
    };
    LoggerService.error = function (error) {
        LoggerService.logger.error(error);
    };
    LoggerService.warn = function (warning) {
        LoggerService.logger.warn(warning);
    };
    LoggerService.debug = function (debug) {
        LoggerService.logger.debug(debug);
    };
    LoggerService.production = process.env.NODE_ENV === 'production';
    LoggerService.transport = LoggerService.production ? new winston_logzio_1.default({
        name: process.env.LOGZIO_NAME,
        token: process.env.LOGZIO_TOKEN,
        host: process.env.LOGZIO_HOST,
    }) : new winston_1.default.transports.Console();
    LoggerService.logger = winston_1.default.createLogger({
        format: winston_1.default.format.simple(),
        transports: [LoggerService.transport],
    });
    return LoggerService;
}());
exports.default = { info: LoggerService.info,
    error: LoggerService.error,
    warn: LoggerService.warn,
    debug: LoggerService.debug
};
