import { Router, type Router as RouterType } from "express"
import { ComplaintController } from "../controllers/complaint.controller.js"
import { AuthMiddleware } from "../middlewares/auth.middleware.js"
import { AdminMiddleware } from "../middlewares/admin.middleware.js"
import { validate } from "../middlewares/validation.middleware.js"
import {
	createComplaintValidation,
	updateComplaintValidation,
	complaintIdValidation,
} from "../validations/complaint.validation.js"

export const complaintRouter: RouterType = Router()

/**
 * @route   POST /api/complaints
 * @desc    Create new complaint
 * @access  Protected (User)
 */
complaintRouter.post(
	"/",
	AuthMiddleware,
	createComplaintValidation,
	validate,
	ComplaintController.createComplaint
)

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints (user sees own, admin sees all)
 * @access  Protected
 */
complaintRouter.get("/", AuthMiddleware, ComplaintController.getAllComplaints)

/**
 * @route   GET /api/complaints/:id
 * @desc    Get complaint by ID
 * @access  Protected
 */
complaintRouter.get(
	"/:id",
	AuthMiddleware,
	complaintIdValidation,
	validate,
	ComplaintController.getComplaintById
)

/**
 * @route   PATCH /api/complaints/:id
 * @desc    Update complaint (status, department, severity)
 * @access  Protected (Admin only)
 */
complaintRouter.patch(
	"/:id",
	AuthMiddleware,
	AdminMiddleware,
	updateComplaintValidation,
	validate,
	ComplaintController.updateComplaint
)

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete complaint
 * @access  Protected (Own complaint or Admin)
 */
complaintRouter.delete(
	"/:id",
	AuthMiddleware,
	complaintIdValidation,
	validate,
	ComplaintController.deleteComplaint
)
