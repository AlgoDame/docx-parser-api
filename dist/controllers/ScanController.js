"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanController = void 0;
var placeholderscanservice_1 = require("../services/placeholderscanservice");
var basecontroller_1 = require("./basecontroller");
/**
 * / route
 *
 * @class ScanController
 */
var ScanController = /** @class */ (function (_super) {
    __extends(ScanController, _super);
    function ScanController() {
        return _super.call(this) || this;
    }
    /**
     * Create the routes.
     *
     * @method loadRoutes
     */
    ScanController.prototype.loadRoutes = function (prefix, router) {
        this.initScanDocument(prefix, router);
    };
    ScanController.prototype.initScanDocument = function (prefix, router) {
        router.post(prefix + "", [this.authorize.bind(this)], function (req, res, next) {
            new placeholderscanservice_1.PlaceholderService().scan(req, res);
        });
    };
    return ScanController;
}(basecontroller_1.BaseController));
exports.ScanController = ScanController;
