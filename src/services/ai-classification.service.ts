import axios from "axios"
import { SARVAM_API_KEY, OPENROUTER_API_KEY } from "../config/dotenv.js"
import { logger } from "../config/logger.js"
import {
	ComplaintType,
	ComplaintSeverity,
	GovernmentDepartment,
} from "../constants/complaint.constants.js"

interface AIClassificationResult {
	category: ComplaintType
	severity: ComplaintSeverity
	department: GovernmentDepartment
	classifiable: boolean
}

// AI Provider type
type AIProvider = "sarvam" | "openrouter"

// Determine primary AI provider based on available keys
const PRIMARY_PROVIDER: AIProvider = SARVAM_API_KEY ? "sarvam" : "openrouter"

/**
 * Generate AI prompt for complaint classification
 */
function generateClassificationPrompt(description?: string, imageUrl?: string): string {
	// Create mapping of display values to enum keys
	const categoryMapping = Object.entries(ComplaintType).map(([key, value]) => 
		`  "${value}" (use: "${key}")`
	).join('\n')
	
	const severityMapping = Object.entries(ComplaintSeverity).map(([key, value]) => 
		`  "${value}" (use: "${key}")`
	).join('\n')
	
	const departmentMapping = Object.entries(GovernmentDepartment).map(([key, value]) => 
		`  "${value}" (use: "${key}")`
	).join('\n')

	let prompt = `You are an AI assistant that classifies citizen complaints for government departments in India.

Analyze the following complaint and provide a JSON response with the classification.

Available Categories (use the enum key in your response):
${categoryMapping}

Available Severities (use the enum key):
${severityMapping}

Available Departments (use the enum key):
${departmentMapping}
`

	if (description) {
		prompt += `\nComplaint Description: "${description}"`
	}

	if (imageUrl) {
		prompt += `\nComplaint Image URL: ${imageUrl}`
		prompt += `\n(IMPORTANT: You MUST analyze this image carefully. Determine what the image actually shows.)`
	}

	prompt += `

IMPORTANT INSTRUCTIONS:
1. Based on the description${imageUrl ? " and image" : ""}, determine the most appropriate classification.
2. If the description is gibberish, meaningless, too vague (e.g. "xyz", "abc", "test", random characters), or does NOT describe any real civic complaint, you MUST return classifiable as false.
3. If you cannot confidently determine the complaint category from the given information, return classifiable as false.

IMAGE VALIDATION (CRITICAL):
- If an image is provided, you MUST analyze what the image actually depicts.
- If the image shows something UNRELATED to any civic complaint (e.g., selfies, random objects, computer screens, food, animals as pets, indoor office/home photos, memes, screenshots, documents, people posing, landscapes without issues, etc.), you MUST return classifiable as false and category as "NOT_A_COMPLAINT".
- The image MUST show a genuine civic issue (e.g., potholes, garbage, broken street lights, flooding, sewage, damaged roads, fallen trees, open manholes, etc.) to be classified as a valid complaint.
- Do NOT force-classify an image into a complaint category just because an image exists. Only classify if the image genuinely shows a civic problem.
- If the description mentions a civic issue but the image clearly contradicts it or is unrelated, prioritize what the IMAGE shows and mark as NOT_A_COMPLAINT.

4. Return ONLY a valid JSON object with enum KEYS (not display values) in this exact format:
{
  "classifiable": true,
  "category": "ENUM_KEY_HERE",
  "severity": "ENUM_KEY_HERE",
  "department": "ENUM_KEY_HERE"
}

5. Example response for a pothole complaint:
{
  "classifiable": true,
  "category": "ROAD_DAMAGE",
  "severity": "HIGH",
  "department": "PUBLIC_WORKS"
}

6. Example response when description is unclear/gibberish:
{
  "classifiable": false,
  "category": "NOT_A_COMPLAINT",
  "severity": "LOW",
  "department": "OTHER"
}

7. Example response when image does NOT show a civic issue (e.g., photo of a computer lab, selfie, food):
{
  "classifiable": false,
  "category": "NOT_A_COMPLAINT",
  "severity": "LOW",
  "department": "OTHER"
}

8. Use ONLY the enum keys shown in parentheses above, not the display values.
9. Do not include any explanation, markdown formatting, or extra text - ONLY the JSON object.`

	return prompt
}

/**
 * Classify complaint using AI (Sarvam or OpenRouter with fallback)
 */
export async function classifyComplaintWithAI(
	description?: string,
	imageUrl?: string
): Promise<AIClassificationResult> {
	try {
		if (!description && !imageUrl) {
			logger.warn("No description or image provided for AI classification")
			return getUnclassifiableResult()
		}

		// Validate description is meaningful (at least 10 chars and contains real words)
		if (description && !imageUrl) {
			const trimmed = description.trim()
			if (trimmed.length < 10 || !/[a-zA-Z]{3,}/.test(trimmed)) {
				logger.warn(`Description too short or meaningless: "${trimmed}"`)
				return getUnclassifiableResult()
			}
		}

		let result: AIClassificationResult | null = null

		// Try primary provider (Sarvam)
		if (PRIMARY_PROVIDER === "sarvam" && SARVAM_API_KEY) {
			logger.info("Trying primary provider: Sarvam AI")
			result = await classifyWithSarvam(description, imageUrl)
			
			// Check if Sarvam returned default classification (failed)
			if (isDefaultClassification(result)) {
				logger.warn("Sarvam AI returned default classification, trying fallback...")
				result = null
			}
		}

		// If primary failed or not available, try OpenRouter
		if (!result && OPENROUTER_API_KEY) {
			logger.info("Trying fallback provider: OpenRouter")
			result = await classifyWithOpenRouter(description, imageUrl)
		}

		// If OpenRouter also failed, try Sarvam as fallback (if it wasn't primary)
		if (!result && PRIMARY_PROVIDER === "openrouter" && SARVAM_API_KEY) {
			logger.info("OpenRouter failed, trying fallback: Sarvam AI")
			result = await classifyWithSarvam(description, imageUrl)
		}

		// Return result or unclassifiable
		if (!result) return getUnclassifiableResult()

		// If AI says it can't classify, mark as unclassifiable
		if (!result.classifiable) {
			logger.warn("AI determined complaint is not classifiable")
			return getUnclassifiableResult()
		}

		return result
	} catch (error) {
		logger.error(`Error in AI classification: ${error}`)
		return getUnclassifiableResult()
	}
}

/**
 * Classify complaint using OpenRouter (DeepSeek v3.2)
 */
async function classifyWithOpenRouter(
	description?: string,
	imageUrl?: string
): Promise<AIClassificationResult> {
	try {
		const prompt = generateClassificationPrompt(description, imageUrl)

		// Use a vision-capable model when image is provided for accurate image analysis
		const model = imageUrl ? "google/gemini-2.0-flash-001" : "deepseek/deepseek-chat"
		logger.info(`Calling OpenRouter (${model}) for complaint classification...`)

		// Build message content - use multimodal format when image is provided
		let messageContent: any
		if (imageUrl) {
			messageContent = [
				{ type: "text", text: prompt },
				{ type: "image_url", image_url: { url: imageUrl } },
			]
		} else {
			messageContent = prompt
		}

		const response = await axios.post(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				model,
				messages: [
					{
						role: "user",
						content: messageContent,
					},
				],
			},
			{
				headers: {
					Authorization: `Bearer ${OPENROUTER_API_KEY}`,
					"Content-Type": "application/json",
				},
				timeout: 30000,
			}
		)

		const rawContent = response.data?.choices?.[0]?.message?.content
		if (!rawContent) {
			logger.error("No content in OpenRouter response")
			return getDefaultClassification()
		}

		logger.info(`OpenRouter raw response: ${rawContent}`)

		// Parse the JSON response
		const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
		if (!jsonMatch) {
			logger.error("Could not extract JSON from OpenRouter response")
			return getDefaultClassification()
		}

		let classification: AIClassificationResult = JSON.parse(jsonMatch[0])

		// Normalize the response
		classification = normalizeClassification(classification)

		// Validate the response
		if (
			!isValidComplaintType(classification.category) ||
			!isValidSeverity(classification.severity) ||
			!isValidDepartment(classification.department)
		) {
			logger.error("Invalid classification values from OpenRouter", classification)
			return getDefaultClassification()
		}

		logger.info("OpenRouter classification successful:", classification)
		return classification
	} catch (error) {
		if (axios.isAxiosError(error)) {
			logger.error(`OpenRouter API error: ${error.response?.status} - ${error.message}`)
		} else {
			logger.error(`Error in OpenRouter classification: ${error}`)
		}
		// Return null to indicate failure, allowing fallback
		return null as any
	}
}

/**
 * Classify complaint using Sarvam AI
 */
async function classifyWithSarvam(
	description?: string,
	imageUrl?: string
): Promise<AIClassificationResult> {
	try {
		logger.info("Calling Sarvam AI for complaint classification...")

		const prompt = generateClassificationPrompt(description, imageUrl)

		const response = await axios.post(
			"https://api.sarvam.ai/v1/chat/completions",
			{
				messages: [
					{
						content: prompt,
						role: "user",
					},
				],
				model: "sarvam-m",
				max_tokens: 500,
			},
			{
				headers: {
					"api-subscription-key": SARVAM_API_KEY,
					"Content-Type": "application/json",
				},
				timeout: 30000,
			}
		)

		const rawContent = response.data?.choices?.[0]?.message?.content
		if (!rawContent) {
			logger.error("No content in Sarvam AI response")
			return getDefaultClassification()
		}

		logger.info(`Sarvam AI raw response: ${rawContent}`)

		// Parse the JSON response
		const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
		if (!jsonMatch) {
			logger.error("Could not extract JSON from Sarvam AI response")
			return getDefaultClassification()
		}

		let classification: AIClassificationResult = JSON.parse(jsonMatch[0])
		
		// Normalize the response in case AI returns display values instead of enum keys
		classification = normalizeClassification(classification)

		// Validate the response
		if (
			!isValidComplaintType(classification.category) ||
			!isValidSeverity(classification.severity) ||
			!isValidDepartment(classification.department)
		) {
			logger.error("Invalid classification values from AI", classification)
			return getDefaultClassification()
		}

		logger.info("AI Classification successful:", classification)
		return classification
	} catch (error) {
		if (axios.isAxiosError(error)) {
			logger.error(`Sarvam AI API error: ${error.response?.status} - ${error.message}`)
		} else {
			logger.error(`Error in Sarvam AI classification: ${error}`)
		}
		// Return null to indicate failure, allowing fallback
		return null as any
	}
}

/**
 * Normalize AI response by converting enum keys to enum values
 */
function normalizeClassification(classification: any): AIClassificationResult {
	// Convert enum keys to enum values if needed
	let category: ComplaintType
	if (Object.keys(ComplaintType).includes(classification.category)) {
		// AI returned enum key (e.g., "ROAD_DAMAGE"), convert to enum value
		category = ComplaintType[classification.category as keyof typeof ComplaintType]
	} else if (Object.values(ComplaintType).includes(classification.category)) {
		// AI returned enum value directly (e.g., "Road Damage/Potholes")
		category = classification.category as ComplaintType
	} else {
		category = ComplaintType.OTHER
	}

	// Convert enum keys to enum values for severity
	let severity: ComplaintSeverity
	if (Object.keys(ComplaintSeverity).includes(classification.severity)) {
		severity = ComplaintSeverity[classification.severity as keyof typeof ComplaintSeverity]
	} else if (Object.values(ComplaintSeverity).includes(classification.severity)) {
		severity = classification.severity as ComplaintSeverity
	} else {
		severity = ComplaintSeverity.MEDIUM
	}

	// Convert enum keys to enum values for department
	let department: GovernmentDepartment
	if (Object.keys(GovernmentDepartment).includes(classification.department)) {
		department = GovernmentDepartment[classification.department as keyof typeof GovernmentDepartment]
	} else if (Object.values(GovernmentDepartment).includes(classification.department)) {
		department = classification.department as GovernmentDepartment
	} else {
		department = GovernmentDepartment.OTHER
	}

	return { category, severity, department, classifiable: classification.classifiable !== false && category !== ComplaintType.NOT_A_COMPLAINT }
}

/**
 * Get default classification if AI fails
 */
function getDefaultClassification(): AIClassificationResult {
	return {
		category: ComplaintType.OTHER,
		severity: ComplaintSeverity.MEDIUM,
		department: GovernmentDepartment.OTHER,
		classifiable: true,
	}
}

/**
 * Get unclassifiable result when AI cannot determine complaint type
 */
function getUnclassifiableResult(): AIClassificationResult {
	return {
		category: ComplaintType.NOT_A_COMPLAINT,
		severity: ComplaintSeverity.LOW,
		department: GovernmentDepartment.OTHER,
		classifiable: false,
	}
}

/**
 * Check if classification result is default (indicating failure)
 */
function isDefaultClassification(classification: AIClassificationResult): boolean {
	return (
		classification.category === ComplaintType.OTHER &&
		classification.severity === ComplaintSeverity.MEDIUM &&
		classification.department === GovernmentDepartment.OTHER
	)
}

/**
 * Validate complaint type - check if it's a valid enum key
 */
function isValidComplaintType(value: string): value is ComplaintType {
	return Object.keys(ComplaintType).includes(value) || Object.values(ComplaintType).includes(value as ComplaintType)
}

/**
 * Validate severity - check if it's a valid enum key
 */
function isValidSeverity(value: string): value is ComplaintSeverity {
	return Object.keys(ComplaintSeverity).includes(value) || Object.values(ComplaintSeverity).includes(value as ComplaintSeverity)
}

/**
 * Validate department - check if it's a valid enum key
 */
function isValidDepartment(value: string): value is GovernmentDepartment {
	return Object.keys(GovernmentDepartment).includes(value) || Object.values(GovernmentDepartment).includes(value as GovernmentDepartment)
}
