import { ComplaintType, ComplaintSeverity, GovernmentDepartment } from "../constants/complaint.constants.js";
interface AIClassificationResult {
    category: ComplaintType;
    severity: ComplaintSeverity;
    department: GovernmentDepartment;
}
/**
 * Classify complaint using AI (Sarvam or OpenRouter with fallback)
 */
export declare function classifyComplaintWithAI(description?: string, imageUrl?: string): Promise<AIClassificationResult>;
export {};
