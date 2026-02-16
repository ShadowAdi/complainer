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
		prompt += `\n(Analyze the image if accessible to understand the complaint better)`
	}

	prompt += `

IMPORTANT INSTRUCTIONS:
1. Based on the description${imageUrl ? " and image" : ""}, determine the most appropriate classification.
2. Return ONLY a valid JSON object with enum KEYS (not display values) in this exact format:
{
  "category": "ENUM_KEY_HERE",
  "severity": "ENUM_KEY_HERE",
  "department": "ENUM_KEY_HERE"
}

3. Example response for a pothole complaint:
{
  "category": "ROAD_DAMAGE",
  "severity": "HIGH",
  "department": "PUBLIC_WORKS"
}

4. Use ONLY the enum keys shown in parentheses above, not the display values.
5. Do not include any explanation, markdown formatting, or extra text - ONLY the JSON object.`

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
			logger.error(`Error in AI classification: ${error}`)
		}
		return getDefaultClassification()
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

	return { category, severity, department }
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
