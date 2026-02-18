import { NextFunction, Request, Response } from "express";
import { IUser, IAuthTokenPayload } from "../interfaces/user.interface.js";
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            userPayload?: IAuthTokenPayload;
        }
    }
}
export declare const AuthMiddleware: (request: Request, response: Response, next: NextFunction) => Promise<void>;
export declare const OptionalAuthMiddleware: (request: Request, response: Response, next: NextFunction) => Promise<void>;
