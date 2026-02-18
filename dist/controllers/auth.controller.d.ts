import { Request, Response, NextFunction } from "express";
export declare class AuthController {
    /**
     * Register or Login user (combined for demo)
     * POST /api/auth
     * If user exists: login
     * If user doesn't exist: register
     */
    static authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get current user profile
     * GET /api/auth/me
     * Protected route
     */
    static getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
