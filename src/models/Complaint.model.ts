import { Schema, model } from "mongoose"
import { IComplaint } from "../interfaces/complaint.interface.js"
import {
    ComplaintType,
    ComplaintSeverity,
    GovernmentDepartment,
    ComplaintStatus,
} from "../constants/complaint.constants.js"

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
            required: false,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
            default: "",
        },
        imageUrl: {
            type: String,
            default: null,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: [true, "Coordinates are required"],
                validate: {
                    validator: function (coords: number[]) {
                        return (
                            coords.length === 2 &&
                            coords[0] >= -180 &&
                            coords[0] <= 180 &&
                            coords[1] >= -90 &&
                            coords[1] <= 90
                        )
                    },
                    message: "Coordinates must be [longitude, latitude] with valid ranges",
                },
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
        imageVerification: {
            trustLevel: {
                type: String,
                enum: ["high", "medium", "low"],
                default: null,
            },
            hasExif: { type: Boolean, default: false },
            hasGps: { type: Boolean, default: false },
            locationSource: {
                type: String,
                enum: ["exif", "gps", "manual"],
                default: null,
            },
            hasTimestamp: { type: Boolean, default: false },
            takenAt: { type: Date, default: null },
            cameraMake: { type: String, default: null },
            cameraModel: { type: String, default: null },
            warnings: { type: [String], default: [] },
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
