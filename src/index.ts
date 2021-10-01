import mongoose from 'mongoose'
import * as dotenv from "dotenv";
import { ConsumerService } from './services/consumerservice';
import express from 'express';
import logger from "morgan";
import {scanRouter} from "./routes/documentroute";
import log from "./logger/logger";
import DirMaker from "./services/directorymaker";


dotenv.config()
if(process.env.DISABLE_SSL){
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const workingDir = process.env.WORKING_DIR;
new DirMaker().createDirectories(workingDir);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, () => {
  console.log('connected to database')
  
})

new ConsumerService().consume();

const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({extended : false}));
app.use("/v1/doc", scanRouter);



app.listen(4000, ()=>{
  console.log(`Listening on port 4000...`)
})



