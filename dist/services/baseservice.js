"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
var chalk = require("chalk");
var crypto = require("crypto");
var qs = require('qs');
var axios = require("axios");
var fs = require('fs');
var logger_1 = __importDefault(require("../logger/logger"));
var BaseService = /** @class */ (function () {
    function BaseService() {
    }
    BaseService.prototype.someMethod = function () {
        return false;
    };
    BaseService.prototype.hasErrors = function (errors) {
        return !(errors === undefined || errors.length == 0);
    };
    BaseService.prototype.sha256 = function (data) {
        return crypto.createHash("sha256").update(data, "utf8").digest("base64");
    };
    BaseService.prototype.sendError = function (req, res, next, data) {
        var dat = {
            status: 400,
            data: data
        };
        res.status(401);
        res.send(dat);
    };
    BaseService.prototype.sendResponse = function (serviceResponse, req, res) {
        var response = {
            status: serviceResponse.getStatusString(),
            data: serviceResponse.getData()
        };
        res.status(this.getHttpStatus(serviceResponse.getStatusString()));
        logger_1.default.info("request to:  " + req.protocol + "://" + req.get('host') + req.originalUrl);
        logger_1.default.info("status is " + response.status);
        res.json(response);
    };
    BaseService.prototype.sendException = function (ex, serviceResponse, req, res, next) {
        logger_1.default.info(chalk.blue.bgRed.bold(ex));
        this.sendResponse(serviceResponse, req, res);
    };
    BaseService.prototype.removeGenericFieldsAndReturn = function (result) {
        result.__v = null;
        result.userId = null;
        result.tenantId = null;
        if (result.nameHash !== undefined) {
            result.nameHash = null;
        }
        return result;
    };
    BaseService.prototype.getHttpStatus = function (status) {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'NOT_FOUND':
                return 404;
            case 'FAILED_VALIDATION':
                return 400;
            case 'CONFLICT':
                return 409;
            case 'FORBIDDEN':
                return 403;
            case 'PRECONDITION_FAILED':
                return 412;
            case 'SUCCESS_NO_CONTENT':
                return 204;
            default:
                return 500;
        }
    };
    BaseService.prototype.logInfo = function (info) {
        logger_1.default.info(chalk.blue.bgGreen.bold(info));
    };
    BaseService.prototype.logError = function (error) {
        logger_1.default.info(chalk.blue.bgRed.bold(error));
    };
    return BaseService;
}());
exports.BaseService = BaseService;
