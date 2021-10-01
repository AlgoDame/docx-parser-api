import express, { Request, Response } from 'express'
import { ScanController } from '../controllers/ScanController';

const router = express.Router()
new ScanController().loadRoutes('/scan', router);

export { router as scanRouter }