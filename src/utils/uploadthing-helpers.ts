import { UTApi } from "uploadthing/server"
import { UPLOADTHING_API_KEY } from "../config/dotenv.js"
import { AppError } from "./AppError.js"

// Initialize UploadThing API client
const utapi = new UTApi({
	token: UPLOADTHING_API_KEY,
})

/**
 * Upload a single image file to UploadThing
 * @param file - The file buffer to upload
 * @param fileName - Name of the file
 * @returns Promise<string> - The URL of the uploaded file
 */
export async function uploadImageToUploadThing(
	file: Buffer,
	fileName: string
): Promise<string> {
	try {
		if (!UPLOADTHING_API_KEY) {
			throw new AppError("UploadThing API key not configured", 500)
		}

		// Convert Buffer to File object
		// @ts-ignore - Buffer is compatible with Blob constructor in Node.js
		const blob = new Blob([file])
		const fileToUpload = new File([blob], fileName, { type: "image/*" })

		// Upload to UploadThing
		const response = await utapi.uploadFiles(fileToUpload)

		if (!response || response.error) {
			throw new AppError(
				`Failed to upload image: ${response?.error?.message || "Unknown error"}`,
				500
			)
		}

		if (!response.data?.url) {
			throw new AppError("Invalid response from UploadThing", 500)
		}

		return response.data.url
	} catch (error) {
		if (error instanceof AppError) {
			throw error
		}
		console.error("Image upload error:", error)
		throw new AppError(`Image upload failed: ${error}`, 500)
	}
}

/**
 * Delete an image from UploadThing
 * @param fileUrl - The URL of the file to delete
 * @returns Promise<void>
 */
export async function deleteImageFromUploadThing(fileUrl: string): Promise<void> {
	try {
		if (!UPLOADTHING_API_KEY) {
			console.warn("UploadThing API key not configured")
			return
		}

		// Extract file key from URL
		// UploadThing URLs are typically: https://utfs.io/f/[fileKey]
		const fileKey = fileUrl.split("/f/")[1] || fileUrl.split("/").pop()
		if (!fileKey) {
			console.warn("Invalid file URL, cannot extract file key")
			return
		}

		await utapi.deleteFiles(fileKey)
		console.log(`Deleted image from UploadThing: ${fileKey}`)
	} catch (error) {
		console.error("Error deleting image from UploadThing:", error)
		// Don't throw error, just log it - we don't want to block deletion
	}
}
