import { IAuthTokenPayload } from "../interfaces/user.interface";
export declare class AuthService {
    private static readonly JWT_SECRET;
    private static readonly JWT_EXPIRES_IN;
    /**
     * Generate JWT token for authenticated user
     */
    static generateToken(payload: IAuthTokenPayload): string;
    /**
     * Verify and decode JWT token
     */
    static verifyToken(token: string): IAuthTokenPayload;
}
