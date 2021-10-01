import amqp from "amqplib";
import log from "../logger/logger";


export class ProviderService {

    public async pushToQueue(recordId: string, url: String, fieldId: string, tenantId: string,invoiceId: string) {

        try {

            if (recordId) {
                const message = {
                    recordId: recordId,
                    file: url,
                    fieldId: fieldId,
                    tenantId: tenantId
                }
                    const connection = await amqp.connect(process.env.RABBITMQ_QUEUE_URL);
                    const channel = await connection.createChannel();
                    const result = await channel.assertQueue(process.env.RABBITMQ_PROCESSED_QUEUE);
                    channel.sendToQueue(process.env.RABBITMQ_PROCESSED_QUEUE, Buffer.from(JSON.stringify(message)));
                    const used = process.memoryUsage();
                    for (let key in used) {
                        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
                    }
                    console.log(`Parsed document job sent successfully`)
                   
              
            } else if (invoiceId){
                const message = {
                    invoiceId,
                    file: url
                }
                    const connection = await amqp.connect(process.env.RABBITMQ_QUEUE_URL);
                    const channel = await connection.createChannel();
                    const result = await channel.assertQueue(process.env.RABBITMQ_PROCESSED_BILLING_QUEUE);
                    channel.sendToQueue(process.env.RABBITMQ_PROCESSED_BILLING_QUEUE, Buffer.from(JSON.stringify(message)));
                    const used = process.memoryUsage();
                    for (let key in used) {
                        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
                    }
                    console.log(`Parsed document job sent successfully`)
            }
        } catch (error) {
            console.log(error)
           
        }


    }

}
