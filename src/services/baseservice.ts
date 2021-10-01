import chalk = require('chalk');
import { BasicResponse } from "../dto/output/basicresponse";
import crypto = require('crypto');
import { NextFunction, Request, Response } from "express";
const qs = require('qs') ;
const axios = require("axios");
const fs = require('fs');
import log from "../logger/logger";


export class BaseService {

    protected errors;

    private someMethod ():  boolean{
        return false;
    }

    protected hasErrors(errors: any) : boolean {
        return !(errors === undefined || errors.length == 0)
    }


    protected sha256(data) {
        return crypto.createHash("sha256").update(data, "utf8").digest("base64");
    }

    protected sendError(req: Request, res: Response, next : NextFunction, data?: Object) {

        var dat = {
            status : 400,
            data: data
        }
        res.status(401);
        res.send(dat);
        
    }

    public sendResponse(serviceResponse: BasicResponse, req: Request, res: Response): any {
        var response = {
          status : serviceResponse.getStatusString() ,
          data: serviceResponse.getData()
        }
    
        res.status(this.getHttpStatus(serviceResponse.getStatusString()));

        log.info(`request to:  ${req.protocol}://${req.get('host')}${req.originalUrl}`);
        log.info(`status is ${response.status}`);
        res.json(response);
    }

    protected sendException(ex, serviceResponse: BasicResponse, req: Request, res: Response, next: NextFunction): any {
        log.info(chalk.blue.bgRed.bold(ex));
        this.sendResponse(serviceResponse, req, res);
    }

    protected removeGenericFieldsAndReturn(result: any): any {
        result.__v = null;
        result.userId = null;
        result.tenantId = null;
        if(result.nameHash !== undefined){
            result.nameHash = null;
        }

        return result;
    }
    
    private getHttpStatus(status: string): number {
        switch(status){
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
    }
    
    protected logInfo(info: string){
        log.info(chalk.blue.bgGreen.bold(info));
    }

    protected logError(error: string){
        log.info(chalk.blue.bgRed.bold(error));
    }

   


    

}