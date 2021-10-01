import amqp from "amqplib";
import { DocumentService } from "./documentservice";
import log from "../logger/logger";



export class ConsumerService  {

    public async consume(){
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_QUEUE_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(process.env.RABBITMQ_QUEUE);
            channel.consume(process.env.RABBITMQ_QUEUE, message => {
                if(message !== null) {
                    const msgObj =  JSON.parse(message.content.toString());
                    
                    console.log(`Received {}, ${msgObj}`)

                    new DocumentService().process(msgObj);
                    channel.ack(message);
                } 
               
            })
           console.log("Waiting for messages...")
        } catch (error) {
            console.log(error)
        }
    }

}