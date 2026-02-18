import { Router,type Router as RouterType } from "express"
import { AuthController } from "../controllers/auth.controller.js"
import { registerValidation, loginValidation } from "../validations/auth.validation.js"
import { validate } from "../middlewares/validation.middleware.js"
import { AuthMiddleware } from "../middlewares/auth.middleware.js"

export const authRouter:RouterType = Router()

/**
 * @route   POST /api/auth
 * @desc    Register or Login user (auto-detects if user exists)
 * @access  Public
 */
authRouter.post(
	"/",
	registerValidation,
	validate,
	AuthController.authenticate
)

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
authRouter.get("/me", AuthMiddleware, AuthController.getProfile)
