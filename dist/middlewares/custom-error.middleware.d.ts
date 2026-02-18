import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
export declare const CustomErrorHandler: (err: AppError, req: Request, response: Response, next: NextFunction) => void;
