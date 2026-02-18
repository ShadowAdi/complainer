import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { registerValidation } from "../validations/auth.validation";
import { validate } from "../middlewares/validation.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
export const authRouter = Router();
/**
 * @route   POST /api/auth
 * @desc    Register or Login user (auto-detects if user exists)
 * @access  Public
 */
authRouter.post("/", registerValidation, validate, AuthController.authenticate);
/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
authRouter.get("/me", AuthMiddleware, AuthController.getProfile);
//# sourceMappingURL=auth.route.js.map