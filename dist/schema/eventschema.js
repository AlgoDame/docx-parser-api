"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var schema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['entry', 'exit'], required: true },
    tenantId: { type: String, required: true },
    userId: { type: String, required: true },
    exitCode: { type: Number, required: false },
    eventTime: { type: Date, required: true }
}, { timestamps: true });
schema.statics.build = function (attr) {
    return new Event(attr);
};
var Event = mongoose_1.default.model('event', schema);
exports.Event = Event;
