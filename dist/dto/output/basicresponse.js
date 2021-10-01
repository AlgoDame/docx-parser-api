"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicResponse = void 0;
var statusenum_1 = require("../enums/statusenum");
var BasicResponse = /** @class */ (function () {
    function BasicResponse(status, data) {
        this.status = status;
        this.data = data;
    }
    BasicResponse.prototype.getData = function () {
        return this.data;
    };
    BasicResponse.prototype.getStatusString = function () {
        return statusenum_1.Status[this.status];
    };
    return BasicResponse;
}());
exports.BasicResponse = BasicResponse;
