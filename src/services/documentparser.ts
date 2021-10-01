import log from "../logger/logger";
const reader = require('any-text');


export default async function parseDoc(filepath){
    try {
        const text = await reader.getText(filepath);

        const regex = /\{[^}]+\}/g;

        const result = text.match(regex);

        if(result){
            let placeholders = result.map(item => item.replace("{", "").replace("}", "").trim());

            return placeholders;

        }else{
            return result;

        }
        

    } catch (error) {
        console.log(error)
        return error;
    }
}




