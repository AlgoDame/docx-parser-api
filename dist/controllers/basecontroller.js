"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var basicresponse_1 = require("../dto/output/basicresponse");
var statusenum_1 = require("../dto/enums/statusenum");
var axios = require("axios");
var logger_1 = __importDefault(require("../logger/logger"));
/**
 * Constructor
 *
 * @class BaseController
 */
var BaseController = /** @class */ (function () {
    function BaseController() {
        this.systemErrorMsg = { "message": "Sorry your request could not be completed at the moment" };
        this.invalidCredentials = { 'message': 'Invalid Credentials' };
        this.notAuthorized = { 'message': 'You are not authorized to access this resource' };
        this.itemNotFound = { 'message': 'Not found' };
        this.noResults = { 'message': 'No results available' };
        this.start = 0;
        this.limit = 20;
        this.user_firstname = null;
        this.user_lastname = null;
        this.user_roles = null;
        this.user_email = null;
        this.user_tenantId = null;
        this.user_id = null;
    }
    BaseController.prototype.initPagination = function (req, post) {
        var obj = post ? req.body : req.query;
        if (obj.start && !isNaN(obj.start)) {
            this.start = +obj.start;
        }
        if (obj.limit && !isNaN(obj.limit)) {
            this.limit = +obj.limit;
        }
    };
    BaseController.prototype.sendResponse = function (serviceResponse, req, res, next) {
        var response = {
            status: serviceResponse.getStatusString(),
            data: serviceResponse.getData()
        };
        res.status(this.getHttpStatus(serviceResponse.getStatusString()));
        res.json(response);
        next();
    };
    BaseController.prototype.getHttpStatus = function (status) {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'FAILED_VALIDATION':
                return 400;
            default:
                return 500;
        }
    };
    BaseController.prototype.sendError = function (req, res, next, data) {
        var dat = {
            status: "error",
            data: data
        };
        res.status(401);
        res.send(dat);
    };
    BaseController.prototype.authorized = function (req, res, next) {
        var token = (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') ? req.headers.authorization.split(' ')[1] : req.query.token;
        if (token === null) {
            logger_1.default.warn('cant find header');
            return false;
        }
        try {
            var publicKey = JSON.parse("\"" + process.env.JWT_PUBLIC_KEY + "\""); //https://github.com/motdotla/dotenv/issues/218
            var user = jsonwebtoken_1.verify(token, publicKey, { algorithms: ['RS256'], issuer: process.env.JWT_ISSUER });
            this.setUserVariables(user, req);
            return true;
        }
        catch (err) {
            logger_1.default.error("Authorization error:  " + err.message);
            return false;
        }
    };
    BaseController.prototype.setUserVariables = function (user, req) {
        this.user_firstname = user.firstname;
        this.user_lastname = user.lastname;
        this.user_email = user.email;
        this.user_roles = user.roles;
        this.user_tenantId = user.organisationId;
        this.user_id = user.userId;
        req.app.locals.tenant = user.organisationId;
    };
    BaseController.prototype.authorize = function (req, res, next) {
        if (!this.authorized(req, res, next)) {
            this.sendError(req, res, next, this.notAuthorized);
        }
        else {
            next();
        }
    };
    BaseController.isNotFormUpload = function (req) {
        return !req.header(BaseController.formHeader);
    };
    BaseController.getFormId = function (req) {
        return req.header(BaseController.formHeader);
    };
    BaseController.prototype.hasUploadError = function (uploadError) {
        return uploadError != null;
    };
    BaseController.prototype.getUploadError = function (multi, req, err) {
        if (err && (err.code === 'LIMIT_FILE_SIZE')) {
            return new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, { field: "file", errorMessage: "file must not exceed 1MB" });
        }
        var uploadedFiles = multi ? req.files : req.file;
        if ((err && (err.code === 'LIMIT_UNEXPECTED_FILE')) || !uploadedFiles) {
            return new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, { field: "file", errorMessage: "no file uploaded" });
        }
        return null;
    };
    BaseController.formHeader = 'X-FORM-ID';
    return BaseController;
}());
exports.BaseController = BaseController;
