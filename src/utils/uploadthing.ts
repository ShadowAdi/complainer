import { createUploadthing, type FileRouter } from "uploadthing/express"
import { logger } from "../config/logger"

const f = createUploadthing()

/**
 * UploadThing file router configuration
 * Defines upload routes and their restrictions
 */
export const uploadRouter = {
	complaintImageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			// Authentication is already handled by auth middleware
			// This is just for metadata
			return { uploadedBy: req.user?._id?.toString() || "unknown" }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.uploadedBy)
			console.log("File URL:", file.url)
            logger.info(`Upload complete for userId: ${metadata.uploadedBy}`)
			return { uploadedBy: metadata.uploadedBy }
		}),
} satisfies FileRouter as FileRouter

export type OurFileRouter = typeof uploadRouter
