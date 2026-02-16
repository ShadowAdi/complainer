import axios from "axios"
import { SARVAM_API_KEY } from "../config/dotenv.js"
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
}

/**
 * Generate AI prompt for complaint classification
 */
function generateClassificationPrompt(description?: string, imageUrl?: string): string {
	const categories = Object.values(ComplaintType).join(", ")
	const severities = Object.values(ComplaintSeverity).join(", ")
	const departments = Object.values(GovernmentDepartment).join(", ")

	let prompt = `You are an AI assistant that classifies citizen complaints for government departments in India.

Analyze the following complaint and provide a JSON response with the classification:

Available Categories: ${categories}
Available Severities: ${severities}
Available Departments: ${departments}
`

	if (description) {
		prompt += `\nComplaint Description: "${description}"`
	}

	if (imageUrl) {
		prompt += `\nComplaint Image URL: ${imageUrl}`
		prompt += `\n(Analyze the image if accessible to understand the complaint better)`
	}

	prompt += `

Instructions:
1. Based on the description${imageUrl ? " and image" : ""}, determine:
   - category: The type of complaint (choose from available categories)
   - severity: How urgent/serious is this issue (LOW, MEDIUM, HIGH, CRITICAL)
   - department: Which government department should handle this (choose from available departments)

2. Return ONLY a valid JSON object in this exact format:
{
  "category": "CATEGORY_NAME",
  "severity": "SEVERITY_LEVEL",
  "department": "DEPARTMENT_NAME"
}

3. Do not include any explanation, just the JSON object.
4. Ensure all values are from the available options provided above.`

	return prompt
}

/**
 * Classify complaint using Sarvam AI
 */
export async function classifyComplaintWithAI(
	description?: string,
	imageUrl?: string
): Promise<AIClassificationResult> {
	try {
		if (!SARVAM_API_KEY) {
			logger.warn("Sarvam API key not configured, using default classification")
			return getDefaultClassification()
		}

		if (!description && !imageUrl) {
			logger.warn("No description or image provided for AI classification")
			return getDefaultClassification()
		}

		const prompt = generateClassificationPrompt(description, imageUrl)

		logger.info("Calling Sarvam AI for complaint classification...")

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

		const classification: AIClassificationResult = JSON.parse(jsonMatch[0])

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
			logger.error(`Error in AI classification: ${error}`)
		}
		return getDefaultClassification()
	}
}

/**
 * Get default classification if AI fails
 */
function getDefaultClassification(): AIClassificationResult {
	return {
		category: ComplaintType.OTHER,
		severity: ComplaintSeverity.MEDIUM,
		department: GovernmentDepartment.OTHER,
	}
}

/**
 * Validate complaint type
 */
function isValidComplaintType(value: string): value is ComplaintType {
	return Object.values(ComplaintType).includes(value as ComplaintType)
}

/**
 * Validate severity
 */
function isValidSeverity(value: string): value is ComplaintSeverity {
	return Object.values(ComplaintSeverity).includes(value as ComplaintSeverity)
}

/**
 * Validate department
 */
function isValidDepartment(value: string): value is GovernmentDepartment {
	return Object.values(GovernmentDepartment).includes(value as GovernmentDepartment)
}
