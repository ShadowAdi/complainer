import { body, param } from "express-validator"
import {
	ComplaintStatus,
	ComplaintSeverity,
	GovernmentDepartment,
} from "../constants/complaint.constants"

export const createComplaintValidation = [
	body("description")
		.optional()
		.trim()
		.notEmpty()
		.withMessage("Description cannot be empty if provided")
		.isLength({ max: 2000 })
		.withMessage("Description cannot exceed 2000 characters")
		.custom((value, { req }) => {
			// At least one of description or image must be provided
			if (!value && !req.file) {
				throw new Error("Either description or image must be provided")
			}
			return true
		}),

	body("latitude")
		.notEmpty()
		.withMessage("Latitude is required")
		.isFloat({ min: -90, max: 90 })
		.withMessage("Latitude must be between -90 and 90"),

	body("longitude")
		.notEmpty()
		.withMessage("Longitude is required")
		.isFloat({ min: -180, max: 180 })
		.withMessage("Longitude must be between -180 and 180"),

	body("address")
		.optional()
		.trim()
		.isLength({ max: 500 })
		.withMessage("Address cannot exceed 500 characters"),

	// Image is handled by multer middleware, validated separately
]

export const updateComplaintValidation = [
	param("id").isMongoId().withMessage("Invalid complaint ID"),

	body("status")
		.optional()
		.isIn(Object.values(ComplaintStatus))
		.withMessage("Invalid status value"),

	body("department")
		.optional()
		.isIn(Object.values(GovernmentDepartment))
		.withMessage("Invalid department value"),

	body("severity")
		.optional()
		.isIn(Object.values(ComplaintSeverity))
		.withMessage("Invalid severity value"),
]

export const complaintIdValidation = [
	param("id").isMongoId().withMessage("Invalid complaint ID"),
]
