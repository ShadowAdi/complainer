import { AuthService } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../config/logger.js";
import { User } from "../models/user.model.js";
export class AuthController {
    /**
     * Register or Login user (combined for demo)
     * POST /api/auth
     * If user exists: login
     * If user doesn't exist: register
     */
    static async authenticate(req, res, next) {
        try {
            const { username, password } = req.body;
            // Check if user exists
            let user = await User.findOne({ username });
            let isNewUser = false;
            if (user) {
                // User exists - verify password (login)
                const isPasswordValid = await user.comparePassword(password);
                if (!isPasswordValid) {
                    throw new AppError("Invalid password", 401);
                }
            }
            else {
                // User doesn't exist - create new user (register)
                // Check if this is admin credentials
                const role = username === "admin" && password === "adminPassword" ? "admin" : "user";
                user = await User.create({
                    username,
                    password,
                    role,
                });
                isNewUser = true;
            }
            // Generate JWT token
            const token = AuthService.generateToken({
                userId: user._id.toString(),
                username: user.username,
            });
            // Prepare response (exclude password)
            const userResponse = {
                _id: user._id.toString(),
                username: user.username,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            const response = {
                user: userResponse,
                token,
            };
            logger.info(`User ${isNewUser ? 'registered' : 'logged in'}: ${user.username}`);
            res.status(isNewUser ? 201 : 200).json({
                status: "success",
                message: isNewUser ? "User registered successfully" : "Login successful",
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get current user profile
     * GET /api/auth/me
     * Protected route
     */
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                throw new AppError("User not authenticated", 401);
            }
            const userResponse = {
                _id: req.user._id.toString(),
                username: req.user.username,
                role: req.user.role,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt,
            };
            res.status(200).json({
                status: "success",
                data: userResponse,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map