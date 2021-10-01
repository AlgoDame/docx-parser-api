"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRouter = void 0;
var express_1 = __importDefault(require("express"));
var ScanController_1 = require("../controllers/ScanController");
var router = express_1.default.Router();
exports.scanRouter = router;
new ScanController_1.ScanController().loadRoutes('/scan', router);
