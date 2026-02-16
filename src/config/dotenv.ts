import { configDotenv } from "dotenv";

configDotenv()

export const PORT = process.env.PORT
export const DB_URL = process.env.DB_URL
export const CLIENT_URL = process.env.CLIENT_URL
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const OTHER_GEMINI_API_KEY = process.env.OTHER_GEMINI_API_KEY
export const SARVAM_API_KEY = process.env.SARVAM_API_KEY
export const UPLOADTHING_API_KEY = process.env.UPLOADTHING_API_KEY
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
export const OTHER_API_KEY = process.env.OTHER_API_KEY
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const NODE_ENV = process.env.NODE_ENV