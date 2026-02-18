import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { AdminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createComplaintValidation, updateComplaintValidation, complaintIdValidation, } from "../validations/complaint.validation.js";
import { upload } from "../config/multer.js";
export const complaintRouter = Router();
/**
 * @route   POST /api/complaints
 * @desc    Create new complaint with optional image upload
 * @access  Protected (User)
 */
complaintRouter.post("/", AuthMiddleware, upload.single("image"), // Handle single image upload with field name "image"
createComplaintValidation, validate, ComplaintController.createComplaint);
/**
 * @route   GET /api/complaints
 * @desc    Get all complaints (user sees own, admin sees all)
 * @access  Protected
 */
complaintRouter.get("/", AuthMiddleware, ComplaintController.getAllComplaints);
/**
 * @route   GET /api/complaints/:id
 * @desc    Get complaint by ID
 * @access  Protected
 */
complaintRouter.get("/:id", AuthMiddleware, complaintIdValidation, validate, ComplaintController.getComplaintById);
/**
 * @route   PATCH /api/complaints/:id
 * @desc    Update complaint (status, department, severity)
 * @access  Protected (Admin only)
 */
complaintRouter.patch("/:id", AuthMiddleware, AdminMiddleware, updateComplaintValidation, validate, ComplaintController.updateComplaint);
/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete complaint
 * @access  Protected (Own complaint or Admin)
 */
complaintRouter.delete("/:id", AuthMiddleware, complaintIdValidation, validate, ComplaintController.deleteComplaint);
//# sourceMappingURL=complaint.route.js.map