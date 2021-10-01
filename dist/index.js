"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv = __importStar(require("dotenv"));
var consumerservice_1 = require("./services/consumerservice");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var documentroute_1 = require("./routes/documentroute");
var logger_1 = __importDefault(require("./logger/logger"));
var directorymaker_1 = __importDefault(require("./services/directorymaker"));
dotenv.config();
if (process.env.DISABLE_SSL) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
var workingDir = process.env.WORKING_DIR;
new directorymaker_1.default().createDirectories(workingDir);
mongoose_1.default.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, function () {
    //log.info('connected to database');
    console.log('connected to database');
});
new consumerservice_1.ConsumerService().consume();
var app = express_1.default();
app.use(express_1.default.json());
app.use(morgan_1.default("dev"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/v1/doc", documentroute_1.scanRouter);
app.listen(4000, function () {
    logger_1.default.info("Listening on port 4000...");
    console.log("Listening on port 4000...");
});
