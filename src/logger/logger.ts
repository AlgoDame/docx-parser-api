import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';
import dotenv from "dotenv";
dotenv.config();


class LoggerService {

    private static production = process.env.NODE_ENV === 'production';

    private static transport = LoggerService.production ? new LogzioWinstonTransport({
        name: process.env.LOGZIO_NAME,
        token: process.env.LOGZIO_TOKEN,
        host: process.env.LOGZIO_HOST,
    }) : new winston.transports.Console()


    private static logger = winston.createLogger({
        format: winston.format.simple(),
        transports: [LoggerService.transport],
    });

    public static info(info) {
        LoggerService.logger.info(info);
    }

    public static error(error) {
        LoggerService.logger.error(error);
    }

    public static warn(warning){
        LoggerService.logger.warn(warning);
    }

    public static debug(debug){
        LoggerService.logger.debug(debug);
    }
}

export default { info: LoggerService.info, 
                 error: LoggerService.error, 
                 warn: LoggerService.warn, 
                 debug: LoggerService.debug 
                };



