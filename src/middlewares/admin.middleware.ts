import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError.js"
import { UserRole } from "../interfaces/user.interface.js"
import { logger } from "../config/logger.js"

/**
 * Admin middleware - checks if authenticated user has admin role
 * Must be used after AuthMiddleware
 */
export const AdminMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		if (!req.user) {
			throw new AppError("Authentication required", 401)
		}

		if (req.user.role !== UserRole.ADMIN) {
			logger.warn(`Unauthorized admin access attempt by user: ${req.user.username}`)
			throw new AppError("Admin access required", 403)
		}

		next()
	} catch (error) {
		next(error)
	}
}
