import { NextFunction, Request, Response, Router } from "express";
import { PlaceholderService } from "../services/placeholderscanservice";
import { BaseController } from "./basecontroller";
/**
 * / route
 *
 * @class ScanController
 */
export class ScanController extends BaseController {
  /**
   * Create the routes.
   *
   * @method loadRoutes
   */
  public loadRoutes(prefix: string, router: Router) {
    this.initScanDocument(prefix, router);
  }

  private initScanDocument(prefix: String, router: Router): any {
    router.post(prefix+"", [this.authorize.bind(this)], (req, res: Response, next: NextFunction) =>{
      new PlaceholderService().scan(req, res);
    })
  }
  
  constructor() {
    super();
  }
}