import FileType from "file-type";
import got from "got";
import log from "../logger/logger";



export default async function isValidFile(url){
    try {
        const stream = await got.stream(url);
        const result = await FileType.fromStream(stream);
        log.info(result);
        
        return result;
    } catch (error) {
        log.error(error.message);
        
    }
}
    
