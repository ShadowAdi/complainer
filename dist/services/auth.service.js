import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
export class AuthService {
    static JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";
    static JWT_EXPIRES_IN = "7d";
    /**
     * Generate JWT token for authenticated user
     */
    static generateToken(payload) {
        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
    }
    /**
     * Verify and decode JWT token
     */
    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError("Token has expired", 401);
            }
            if (error.name === "JsonWebTokenError") {
                throw new AppError("Invalid token", 401);
            }
            throw new AppError("Token verification failed", 401);
        }
    }
}
//# sourceMappingURL=auth.service.js.map