import { Request, Response, NextFunction } from "express";
/**
 * Admin middleware - checks if authenticated user has admin role
 * Must be used after AuthMiddleware
 */
export declare const AdminMiddleware: (req: Request, res: Response, next: NextFunction) => void;
