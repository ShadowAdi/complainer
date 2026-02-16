/**
 * Complaint Management System Constants
 * For AI-Based Local Governance Complaint Redressal System (India)
 */

/**
 * Complaint Severity Levels
 * Used for prioritizing complaints
 */
export enum ComplaintSeverity {
	LOW = "Low",
	MEDIUM = "Medium",
	HIGH = "High",
}

export const SEVERITY_LEVELS = [
	ComplaintSeverity.LOW,
	ComplaintSeverity.MEDIUM,
	ComplaintSeverity.HIGH,
] as const

/**
 * Indian Local Government Departments
 * Departments responsible for different civic issues
 */
export enum GovernmentDepartment {
	WATER_SUPPLY = "Water Supply Department",
	SANITATION = "Sanitation and Waste Management",
	PUBLIC_WORKS = "Public Works Department (PWD)",
	ELECTRICITY = "Electricity and Street Lights",
	DRAINAGE = "Drainage and Sewage Department",
	PARKS_GARDENS = "Parks and Gardens Department",
	HEALTH_HYGIENE = "Health and Hygiene Department",
	TRAFFIC_TRANSPORT = "Traffic and Transport Department",
	BUILDING_CONSTRUCTION = "Building and Construction Department",
	MUNICIPAL_CORPORATION = "Municipal Corporation Office",
	REVENUE = "Revenue Department",
	OTHER = "Other Department",
}

export const DEPARTMENT_LIST = [
	GovernmentDepartment.WATER_SUPPLY,
	GovernmentDepartment.SANITATION,
	GovernmentDepartment.PUBLIC_WORKS,
	GovernmentDepartment.ELECTRICITY,
	GovernmentDepartment.DRAINAGE,
	GovernmentDepartment.PARKS_GARDENS,
	GovernmentDepartment.HEALTH_HYGIENE,
	GovernmentDepartment.TRAFFIC_TRANSPORT,
	GovernmentDepartment.BUILDING_CONSTRUCTION,
	GovernmentDepartment.MUNICIPAL_CORPORATION,
	GovernmentDepartment.REVENUE,
	GovernmentDepartment.OTHER,
] as const

/**
 * Complaint Types/Categories
 * Common civic issues in Indian local governance
 */
export enum ComplaintType {
	WATER_LOGGING = "Water Logging/Flooding",
	WATER_SHORTAGE = "Water Shortage/No Supply",
	GARBAGE_COLLECTION = "Garbage Collection Issue",
	GARBAGE_DUMPING = "Illegal Garbage Dumping",
	ROAD_DAMAGE = "Road Damage/Potholes",
	ROAD_CONSTRUCTION = "Road Construction Issue",
	STREET_LIGHT = "Street Light Not Working",
	DRAINAGE_BLOCKAGE = "Drainage Blockage/Overflow",
	SEWAGE_OVERFLOW = "Sewage Overflow",
	ILLEGAL_CONSTRUCTION = "Illegal Construction",
	ENCROACHMENT = "Encroachment on Public Property",
	NOISE_POLLUTION = "Noise Pollution",
	AIR_POLLUTION = "Air Pollution",
	STRAY_ANIMALS = "Stray Animals Issue",
	TREE_FALLEN = "Fallen Tree/Branch",
	PARK_MAINTENANCE = "Park Maintenance Issue",
	PUBLIC_TOILET = "Public Toilet Issue",
	TRAFFIC_SIGNAL = "Traffic Signal Not Working",
	TRAFFIC_CONGESTION = "Traffic Congestion",
	ILLEGAL_PARKING = "Illegal Parking",
	POWER_OUTAGE = "Power Outage",
	MOSQUITO_BREEDING = "Mosquito Breeding/Fogging Required",
	MANHOLE_OPEN = "Open Manhole/Safety Hazard",
	OTHER = "Other",
}

export const COMPLAINT_CATEGORIES = [
	ComplaintType.WATER_LOGGING,
	ComplaintType.WATER_SHORTAGE,
	ComplaintType.GARBAGE_COLLECTION,
	ComplaintType.GARBAGE_DUMPING,
	ComplaintType.ROAD_DAMAGE,
	ComplaintType.ROAD_CONSTRUCTION,
	ComplaintType.STREET_LIGHT,
	ComplaintType.DRAINAGE_BLOCKAGE,
	ComplaintType.SEWAGE_OVERFLOW,
	ComplaintType.ILLEGAL_CONSTRUCTION,
	ComplaintType.ENCROACHMENT,
	ComplaintType.NOISE_POLLUTION,
	ComplaintType.AIR_POLLUTION,
	ComplaintType.STRAY_ANIMALS,
	ComplaintType.TREE_FALLEN,
	ComplaintType.PARK_MAINTENANCE,
	ComplaintType.PUBLIC_TOILET,
	ComplaintType.TRAFFIC_SIGNAL,
	ComplaintType.TRAFFIC_CONGESTION,
	ComplaintType.ILLEGAL_PARKING,
	ComplaintType.POWER_OUTAGE,
	ComplaintType.MOSQUITO_BREEDING,
	ComplaintType.MANHOLE_OPEN,
	ComplaintType.OTHER,
] as const

/**
 * Complaint Resolution Status
 * Tracks the lifecycle of a complaint
 */
export enum ComplaintStatus {
	PENDING = "Pending",
	ACKNOWLEDGED = "Acknowledged",
	IN_PROGRESS = "In Progress",
	UNDER_REVIEW = "Under Review",
	RESOLVED = "Resolved",
	CLOSED = "Closed",
	REJECTED = "Rejected",
}

export const STATUS_WORKFLOW = [
	ComplaintStatus.PENDING,
	ComplaintStatus.ACKNOWLEDGED,
	ComplaintStatus.IN_PROGRESS,
	ComplaintStatus.UNDER_REVIEW,
	ComplaintStatus.RESOLVED,
	ComplaintStatus.CLOSED,
	ComplaintStatus.REJECTED,
] as const

/**
 * Department to Complaint Type Mapping
 * Helper mapping for AI classification
 */
export const DEPARTMENT_COMPLAINT_MAPPING: Record<
	GovernmentDepartment,
	ComplaintType[]
> = {
	[GovernmentDepartment.WATER_SUPPLY]: [
		ComplaintType.WATER_LOGGING,
		ComplaintType.WATER_SHORTAGE,
	],
	[GovernmentDepartment.SANITATION]: [
		ComplaintType.GARBAGE_COLLECTION,
		ComplaintType.GARBAGE_DUMPING,
		ComplaintType.PUBLIC_TOILET,
	],
	[GovernmentDepartment.PUBLIC_WORKS]: [
		ComplaintType.ROAD_DAMAGE,
		ComplaintType.ROAD_CONSTRUCTION,
		ComplaintType.MANHOLE_OPEN,
	],
	[GovernmentDepartment.ELECTRICITY]: [
		ComplaintType.STREET_LIGHT,
		ComplaintType.POWER_OUTAGE,
	],
	[GovernmentDepartment.DRAINAGE]: [
		ComplaintType.DRAINAGE_BLOCKAGE,
		ComplaintType.SEWAGE_OVERFLOW,
		ComplaintType.WATER_LOGGING,
	],
	[GovernmentDepartment.PARKS_GARDENS]: [
		ComplaintType.PARK_MAINTENANCE,
		ComplaintType.TREE_FALLEN,
	],
	[GovernmentDepartment.HEALTH_HYGIENE]: [
		ComplaintType.MOSQUITO_BREEDING,
		ComplaintType.GARBAGE_DUMPING,
	],
	[GovernmentDepartment.TRAFFIC_TRANSPORT]: [
		ComplaintType.TRAFFIC_SIGNAL,
		ComplaintType.TRAFFIC_CONGESTION,
		ComplaintType.ILLEGAL_PARKING,
	],
	[GovernmentDepartment.BUILDING_CONSTRUCTION]: [
		ComplaintType.ILLEGAL_CONSTRUCTION,
		ComplaintType.ENCROACHMENT,
	],
	[GovernmentDepartment.MUNICIPAL_CORPORATION]: [
		ComplaintType.NOISE_POLLUTION,
		ComplaintType.AIR_POLLUTION,
		ComplaintType.STRAY_ANIMALS,
	],
	[GovernmentDepartment.REVENUE]: [],
	[GovernmentDepartment.OTHER]: [ComplaintType.OTHER],
}

/**
 * Severity Priority Mapping
 * Helps in determining severity based on complaint type
 */
export const COMPLAINT_SEVERITY_PRIORITY: Record<
	ComplaintType,
	ComplaintSeverity
> = {
	[ComplaintType.WATER_LOGGING]: ComplaintSeverity.HIGH,
	[ComplaintType.WATER_SHORTAGE]: ComplaintSeverity.HIGH,
	[ComplaintType.GARBAGE_COLLECTION]: ComplaintSeverity.MEDIUM,
	[ComplaintType.GARBAGE_DUMPING]: ComplaintSeverity.MEDIUM,
	[ComplaintType.ROAD_DAMAGE]: ComplaintSeverity.MEDIUM,
	[ComplaintType.ROAD_CONSTRUCTION]: ComplaintSeverity.LOW,
	[ComplaintType.STREET_LIGHT]: ComplaintSeverity.MEDIUM,
	[ComplaintType.DRAINAGE_BLOCKAGE]: ComplaintSeverity.HIGH,
	[ComplaintType.SEWAGE_OVERFLOW]: ComplaintSeverity.HIGH,
	[ComplaintType.ILLEGAL_CONSTRUCTION]: ComplaintSeverity.MEDIUM,
	[ComplaintType.ENCROACHMENT]: ComplaintSeverity.MEDIUM,
	[ComplaintType.NOISE_POLLUTION]: ComplaintSeverity.LOW,
	[ComplaintType.AIR_POLLUTION]: ComplaintSeverity.MEDIUM,
	[ComplaintType.STRAY_ANIMALS]: ComplaintSeverity.LOW,
	[ComplaintType.TREE_FALLEN]: ComplaintSeverity.HIGH,
	[ComplaintType.PARK_MAINTENANCE]: ComplaintSeverity.LOW,
	[ComplaintType.PUBLIC_TOILET]: ComplaintSeverity.MEDIUM,
	[ComplaintType.TRAFFIC_SIGNAL]: ComplaintSeverity.HIGH,
	[ComplaintType.TRAFFIC_CONGESTION]: ComplaintSeverity.MEDIUM,
	[ComplaintType.ILLEGAL_PARKING]: ComplaintSeverity.LOW,
	[ComplaintType.POWER_OUTAGE]: ComplaintSeverity.HIGH,
	[ComplaintType.MOSQUITO_BREEDING]: ComplaintSeverity.MEDIUM,
	[ComplaintType.MANHOLE_OPEN]: ComplaintSeverity.HIGH,
	[ComplaintType.OTHER]: ComplaintSeverity.MEDIUM,
}

/**
 * Helper function to get department by complaint type
 */
export function getDepartmentByComplaintType(
	complaintType: ComplaintType
): GovernmentDepartment {
	for (const [department, types] of Object.entries(
		DEPARTMENT_COMPLAINT_MAPPING
	)) {
		if (types.includes(complaintType)) {
			return department as GovernmentDepartment
		}
	}
	return GovernmentDepartment.OTHER
}

/**
 * Helper function to get default severity by complaint type
 */
export function getSeverityByComplaintType(
	complaintType: ComplaintType
): ComplaintSeverity {
	return (
		COMPLAINT_SEVERITY_PRIORITY[complaintType] || ComplaintSeverity.MEDIUM
	)
}
