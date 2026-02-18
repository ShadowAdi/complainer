import jwt from "jsonwebtoken"
import { IAuthTokenPayload } from "../interfaces/user.interface.js"
import { AppError } from "../utils/AppError.js"

export class AuthService {
	private static readonly JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key"
	private static readonly JWT_EXPIRES_IN = "7d"

	/**
	 * Generate JWT token for authenticated user
	 */
	static generateToken(payload: IAuthTokenPayload): string {
		return jwt.sign(payload, this.JWT_SECRET, {
			expiresIn: this.JWT_EXPIRES_IN,
		})
	}

	/**
	 * Verify and decode JWT token
	 */
	static verifyToken(token: string): IAuthTokenPayload {
		try {
			const decoded = jwt.verify(token, this.JWT_SECRET) as IAuthTokenPayload
			return decoded
		} catch (error: any) {
			if (error.name === "TokenExpiredError") {
				throw new AppError("Token has expired", 401)
			}
			if (error.name === "JsonWebTokenError") {
				throw new AppError("Invalid token", 401)
			}
			throw new AppError("Token verification failed", 401)
		}
	}
}
