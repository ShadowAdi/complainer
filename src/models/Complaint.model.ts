import { Schema, model } from "mongoose"
import { IComplaint } from "../interfaces/complaint.interface"
import {
	ComplaintType,
	ComplaintSeverity,
	GovernmentDepartment,
	ComplaintStatus,
} from "../constants/complaint.constants"

const ComplaintSchema = new Schema<IComplaint>(
	{
		userId: {
			type: String,
			required: [true, "User ID is required"],
			ref: "User",
			index: true,
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
			maxlength: [2000, "Description cannot exceed 2000 characters"],
		},
		imageUrl: {
			type: String,
			default: null,
		},
		location: {
			latitude: {
				type: Number,
				required: [true, "Latitude is required"],
				min: [-90, "Latitude must be between -90 and 90"],
				max: [90, "Latitude must be between -90 and 90"],
			},
			longitude: {
				type: Number,
				required: [true, "Longitude is required"],
				min: [-180, "Longitude must be between -180 and 180"],
				max: [180, "Longitude must be between -180 and 180"],
			},
			address: {
				type: String,
				default: null,
			},
		},
		category: {
			type: String,
			enum: Object.values(ComplaintType),
			default: ComplaintType.OTHER,
			index: true,
		},
		severity: {
			type: String,
			enum: Object.values(ComplaintSeverity),
			default: ComplaintSeverity.MEDIUM,
			index: true,
		},
		department: {
			type: String,
			enum: Object.values(GovernmentDepartment),
			default: GovernmentDepartment.OTHER,
			index: true,
		},
		status: {
			type: String,
			enum: Object.values(ComplaintStatus),
			default: ComplaintStatus.PENDING,
			index: true,
		},
		resolvedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
)

// 2dsphere index for geospatial queries (nearby complaints, radius search)
ComplaintSchema.index({ location: "2dsphere" })

// Index for user's complaints
ComplaintSchema.index({ userId: 1, createdAt: -1 })

// Index for status filtering
ComplaintSchema.index({ status: 1, createdAt: -1 })

// Compound index for department and status
ComplaintSchema.index({ department: 1, status: 1 })

// Update resolvedAt when status changes to RESOLVED or CLOSED
ComplaintSchema.pre<IComplaint>("save", function (next) {
	if (
		this.isModified("status") &&
		(this.status === ComplaintStatus.RESOLVED ||
			this.status === ComplaintStatus.CLOSED)
	) {
		if (!this.resolvedAt) {
			this.resolvedAt = new Date()
		}
	}
	next()
})

export const Complaint = model<IComplaint>("Complaint", ComplaintSchema)
