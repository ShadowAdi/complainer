import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/auth/jwt-extended.payload.js";
import { JWT_SECRET_KEY } from "../config/dotenv.js";
import { logger } from "../config/logger.js";

declare global {
    namespace Express {
        interface Request {
            user?: JwtUserPayload;
        }
    }
}

export const AuthMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        logger.error(`Token Not Provided: ${token}`);
        throw new AppError(`Not Authenticated`, 401);
    }

    if (!JWT_SECRET_KEY) {
        logger.error(`Failed to get The JWT Key. Please Provide it First`);
        throw new AppError(`INTERNAL SERVER ERROR`, 500);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtUserPayload;
        request.user = decoded;
        next();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`Invalid or expired token ${token} and error is: ${errorMessage}`)
        throw new AppError("Invalid or expired token", 401);
    }
};

// Optional authentication middleware - doesn't throw error if no token
export const OptionalAuthMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
        // No token provided, continue without authentication
        request.user = undefined;
        return next();
    }

    if (!JWT_SECRET_KEY) {
        logger.error(`Failed to get The JWT Key. Please Provide it First`);
        throw new AppError(`INTERNAL SERVER ERROR`, 500);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtUserPayload;
        request.user = decoded;
        next();
    } catch (err) {
        // Invalid token, continue without authentication
        logger.warn(`Invalid token provided, continuing without authentication`);
        request.user = undefined;
        next();
    }
};