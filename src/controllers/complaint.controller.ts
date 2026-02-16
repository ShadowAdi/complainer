import { Request, Response, NextFunction } from "express"
import { Complaint } from "../models/Complaint.model.js"
import { AppError } from "../utils/AppError.js"
import { logger } from "../config/logger.js"
import {
	IComplaintCreateInput,
	IComplaintResponse,
	IComplaintUpdateInput,
} from "../interfaces/complaint.interface.js"
import {
	ComplaintStatus,
	ComplaintType,
	ComplaintSeverity,
	GovernmentDepartment,
	getDepartmentByComplaintType,
	getSeverityByComplaintType,
} from "../constants/complaint.constants.js"

export class ComplaintController {
	/**
	 * Create new complaint
	 * POST /api/complaints
	 * Protected route
	 */
	static async createComplaint(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.user) {
				throw new AppError("Authentication required", 401)
			}

			const { description, latitude, longitude, address } = req.body

			// For now, we set default category, department, and severity
			// Later AI will classify these
			const category = ComplaintType.OTHER
			const department = getDepartmentByComplaintType(category)
			const severity = getSeverityByComplaintType(category)

			// Create complaint with GeoJSON format
			const complaint = await Complaint.create({
				userId: req.user._id,
				description,
				location: {
					type: "Point",
					coordinates: [longitude, latitude], // GeoJSON: [lng, lat]
					address: address || null,
				},
				category,
				severity,
				department,
				status: ComplaintStatus.PENDING,
			})

			logger.info(`Complaint created: ${complaint._id} by user: ${req.user.username}`)

			const response: IComplaintResponse = {
				_id: complaint._id.toString(),
				userId: complaint.userId,
				description: complaint.description,
				imageUrl: complaint.imageUrl,
				location: complaint.location,
				category: complaint.category,
				severity: complaint.severity,
				department: complaint.department,
				status: complaint.status,
				createdAt: complaint.createdAt,
				updatedAt: complaint.updatedAt,
				resolvedAt: complaint.resolvedAt,
			}

			res.status(201).json({
				status: "success",
				message: "Complaint created successfully",
				data: response,
			})
		} catch (error) {
			next(error)
		}
	}

	/**
	 * Get all complaints
	 * GET /api/complaints
	 * Protected route
	 * Users see only their complaints, admins see all
	 */
	static async getAllComplaints(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.user) {
				throw new AppError("Authentication required", 401)
			}

			// Build query based on user role
			const query: any = {}
			if (req.user.role !== "admin") {
				// Normal users only see their own complaints
				query.userId = req.user._id
			}

			// Get query params for filtering
			const { status, severity, department, category } = req.query

			if (status) query.status = status
			if (severity) query.severity = severity
			if (department) query.department = department
			if (category) query.category = category

			// Pagination
			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 10
			const skip = (page - 1) * limit

			// Get complaints
			const [complaints, total] = await Promise.all([
				Complaint.find(query)
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				Complaint.countDocuments(query),
			])

			const response = complaints.map((complaint) => ({
				_id: complaint._id.toString(),
				userId: complaint.userId,
			description: complaint.description,
			imageUrl: complaint.imageUrl,
			location: complaint.location,
				status: complaint.status,
				createdAt: complaint.createdAt,
				updatedAt: complaint.updatedAt,
				resolvedAt: complaint.resolvedAt,
			}))

			res.status(200).json({
				status: "success",
				data: {
					complaints: response,
					pagination: {
						page,
						limit,
						total,
						totalPages: Math.ceil(total / limit),
					},
				},
			})
		} catch (error) {
			next(error)
		}
	}

	/**
	 * Get complaint by ID
	 * GET /api/complaints/:id
	 * Protected route
	 */
	static async getComplaintById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.user) {
				throw new AppError("Authentication required", 401)
			}

			const { id } = req.params

			const complaint = await Complaint.findById(id).lean()

			if (!complaint) {
				throw new AppError("Complaint not found", 404)
			}

			// Check if user has access to this complaint
			if (
				req.user.role !== "admin" &&
				complaint.userId !== req.user._id.toString()
			) {
				throw new AppError("Access denied", 403)
			}

			const response: IComplaintResponse = {
				_id: complaint._id.toString(),
				userId: complaint.userId,

				description: complaint.description,
				imageUrl: complaint.imageUrl,
				location: complaint.location,
				category: complaint.category,
				severity: complaint.severity,
				department: complaint.department,
				status: complaint.status,
				createdAt: complaint.createdAt,
				updatedAt: complaint.updatedAt,
				resolvedAt: complaint.resolvedAt,
			}

			res.status(200).json({
				status: "success",
				data: response,
			})
		} catch (error) {
			next(error)
		}
	}

	/**
	 * Update complaint (admin only)
	 * PATCH /api/complaints/:id
	 * Admin only - can update status, department, severity
	 */
	static async updateComplaint(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.user) {
				throw new AppError("Authentication required", 401)
			}

			const { id } = req.params
			const { status, department, severity }: IComplaintUpdateInput = req.body

			const complaint = await Complaint.findById(id)

			if (!complaint) {
				throw new AppError("Complaint not found", 404)
			}

			// Update fields
			if (status) complaint.status = status
			if (department) complaint.department = department
			if (severity) complaint.severity = severity

			await complaint.save()

			logger.info(
				`Complaint updated: ${complaint._id} by admin: ${req.user.username}`
			)

			const response: IComplaintResponse = {
				_id: complaint._id.toString(),
				userId: complaint.userId,
				description: complaint.description,
				imageUrl: complaint.imageUrl,
				location: complaint.location,
				category: complaint.category,
				severity: complaint.severity,
				department: complaint.department,
				status: complaint.status,
				createdAt: complaint.createdAt,
				updatedAt: complaint.updatedAt,
				resolvedAt: complaint.resolvedAt,
			}

			res.status(200).json({
				status: "success",
				message: "Complaint updated successfully",
				data: response,
			})
		} catch (error) {
			next(error)
		}
	}

	/**
	 * Delete complaint
	 * DELETE /api/complaints/:id
	 * Users can delete their own, admins can delete any
	 */
	static async deleteComplaint(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (!req.user) {
				throw new AppError("Authentication required", 401)
			}

			const { id } = req.params

			const complaint = await Complaint.findById(id)

			if (!complaint) {
				throw new AppError("Complaint not found", 404)
			}

			// Check if user has permission to delete
			if (
				req.user.role !== "admin" &&
				complaint.userId !== req.user._id.toString()
			) {
				throw new AppError("Access denied", 403)
			}

			await Complaint.findByIdAndDelete(id)

			logger.info(
				`Complaint deleted: ${id} by user: ${req.user.username}`
			)

			res.status(200).json({
				status: "success",
				message: "Complaint deleted successfully",
			})
		} catch (error) {
			next(error)
		}
	}
}
