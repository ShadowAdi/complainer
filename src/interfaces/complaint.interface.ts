import { Document, Types } from "mongoose"
import {
	ComplaintType,
	ComplaintSeverity,
	GovernmentDepartment,
	ComplaintStatus,
} from "../constants/complaint.constants"

export interface IComplaint extends Document {
	_id: Types.ObjectId
	userId: string
	description: string
	imageUrl?: string
	location: {
		type: string
		coordinates: [number, number] // [longitude, latitude]
		address?: string
	}
	category: ComplaintType
	severity: ComplaintSeverity
	department: GovernmentDepartment
	status: ComplaintStatus
	createdAt: Date
	updatedAt: Date
	resolvedAt?: Date
}

export interface IComplaintCreateInput {
	description: string
	image?: any // File input (not processed yet)
	latitude: number
	longitude: number
	address?: string
}

export interface IComplaintUpdateInput {
	status?: ComplaintStatus
	department?: GovernmentDepartment
	severity?: ComplaintSeverity
}

export interface IComplaintResponse {
	_id: string
	userId: string
	description: string
	imageUrl?: string
	location: {
		type: string
		coordinates: [number, number]
		address?: string
	}
	category: ComplaintType
	severity: ComplaintSeverity
	department: GovernmentDepartment
	status: ComplaintStatus
	createdAt: Date
	updatedAt: Date
	resolvedAt?: Date
}
