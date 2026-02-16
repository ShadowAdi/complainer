import multer from "multer"
import { AppError } from "../utils/AppError.js"
import { logger } from "./logger.js"

// Configure multer to store files in memory as Buffer
const storage = multer.memoryStorage()

// File filter to only accept images
const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	// Accept only image files
	if (file.mimetype.startsWith("image/")) {
		cb(null, true)
	} else {
        logger.error(`Only Image files are allowed`)
		cb(new AppError("Only image files are allowed", 400) as any)
	}
}

// Create multer instance
export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 4 * 1024 * 1024, // 4MB limit
	},
})
