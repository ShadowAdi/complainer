import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/dotenv.js";
import { logger } from "../config/logger.js";
import { User } from "../models/user.model.js";
import { IUser, IAuthTokenPayload } from "../interfaces/user.interface.js";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            userPayload?: IAuthTokenPayload;
        }
    }
}

export const AuthMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const authHeader = request.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        
        if (!token) {
            logger.error(`Token Not Provided`);
            throw new AppError(`Not Authenticated`, 401);
        }

        if (!JWT_SECRET_KEY) {
            logger.error(`Failed to get The JWT Key. Please Provide it First`);
            throw new AppError(`INTERNAL SERVER ERROR`, 500);
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as IAuthTokenPayload;
        
        // Fetch user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            logger.error(`User not found for token: ${decoded.userId}`);
            throw new AppError("User not found", 401);
        }

        // Attach full user object to request
        request.user = user;
        request.userPayload = decoded;
        next();
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error(`Auth middleware error: ${errorMessage}`);
        
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError("Invalid or expired token", 401));
        }
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
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as IAuthTokenPayload;
        const user = await User.findById(decoded.userId);
        request.user = user || undefined;
        request.userPayload = decoded;
        next();
    } catch (err) {
        // Invalid token, continue without authentication
        logger.warn(`Invalid token provided, continuing without authentication`);
        request.user = undefined;
        next();
    }
};