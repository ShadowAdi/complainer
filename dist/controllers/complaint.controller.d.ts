import { Request, Response, NextFunction } from "express";
export declare class ComplaintController {
    /**
     * Create new complaint
     * POST /api/complaints
     * Protected route
     */
    static createComplaint(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all complaints
     * GET /api/complaints
     * Protected route
     * Users see only their complaints, admins see all
     */
    static getAllComplaints(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get complaint by ID
     * GET /api/complaints/:id
     * Protected route
     */
    static getComplaintById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update complaint (admin only)
     * PATCH /api/complaints/:id
     * Admin only - can update status, department, severity
     */
    static updateComplaint(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete complaint
     * DELETE /api/complaints/:id
     * Users can delete their own, admins can delete any
     */
    static deleteComplaint(req: Request, res: Response, next: NextFunction): Promise<void>;
}
