/**
 * Complaint Management System Constants
 * For AI-Based Local Governance Complaint Redressal System (India)
 */
/**
 * Complaint Severity Levels
 * Used for prioritizing complaints
 */
export declare enum ComplaintSeverity {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High"
}
export declare const SEVERITY_LEVELS: readonly [ComplaintSeverity.LOW, ComplaintSeverity.MEDIUM, ComplaintSeverity.HIGH];
/**
 * Indian Local Government Departments
 * Departments responsible for different civic issues
 */
export declare enum GovernmentDepartment {
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
    OTHER = "Other Department"
}
export declare const DEPARTMENT_LIST: readonly [GovernmentDepartment.WATER_SUPPLY, GovernmentDepartment.SANITATION, GovernmentDepartment.PUBLIC_WORKS, GovernmentDepartment.ELECTRICITY, GovernmentDepartment.DRAINAGE, GovernmentDepartment.PARKS_GARDENS, GovernmentDepartment.HEALTH_HYGIENE, GovernmentDepartment.TRAFFIC_TRANSPORT, GovernmentDepartment.BUILDING_CONSTRUCTION, GovernmentDepartment.MUNICIPAL_CORPORATION, GovernmentDepartment.REVENUE, GovernmentDepartment.OTHER];
/**
 * Complaint Types/Categories
 * Common civic issues in Indian local governance
 */
export declare enum ComplaintType {
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
    OTHER = "Other"
}
export declare const COMPLAINT_CATEGORIES: readonly [ComplaintType.WATER_LOGGING, ComplaintType.WATER_SHORTAGE, ComplaintType.GARBAGE_COLLECTION, ComplaintType.GARBAGE_DUMPING, ComplaintType.ROAD_DAMAGE, ComplaintType.ROAD_CONSTRUCTION, ComplaintType.STREET_LIGHT, ComplaintType.DRAINAGE_BLOCKAGE, ComplaintType.SEWAGE_OVERFLOW, ComplaintType.ILLEGAL_CONSTRUCTION, ComplaintType.ENCROACHMENT, ComplaintType.NOISE_POLLUTION, ComplaintType.AIR_POLLUTION, ComplaintType.STRAY_ANIMALS, ComplaintType.TREE_FALLEN, ComplaintType.PARK_MAINTENANCE, ComplaintType.PUBLIC_TOILET, ComplaintType.TRAFFIC_SIGNAL, ComplaintType.TRAFFIC_CONGESTION, ComplaintType.ILLEGAL_PARKING, ComplaintType.POWER_OUTAGE, ComplaintType.MOSQUITO_BREEDING, ComplaintType.MANHOLE_OPEN, ComplaintType.OTHER];
/**
 * Complaint Resolution Status
 * Tracks the lifecycle of a complaint
 */
export declare enum ComplaintStatus {
    PENDING = "Pending",
    ACKNOWLEDGED = "Acknowledged",
    IN_PROGRESS = "In Progress",
    UNDER_REVIEW = "Under Review",
    RESOLVED = "Resolved",
    CLOSED = "Closed",
    REJECTED = "Rejected"
}
export declare const STATUS_WORKFLOW: readonly [ComplaintStatus.PENDING, ComplaintStatus.ACKNOWLEDGED, ComplaintStatus.IN_PROGRESS, ComplaintStatus.UNDER_REVIEW, ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED, ComplaintStatus.REJECTED];
/**
 * Department to Complaint Type Mapping
 * Helper mapping for AI classification
 */
export declare const DEPARTMENT_COMPLAINT_MAPPING: Record<GovernmentDepartment, ComplaintType[]>;
/**
 * Severity Priority Mapping
 * Helps in determining severity based on complaint type
 */
export declare const COMPLAINT_SEVERITY_PRIORITY: Record<ComplaintType, ComplaintSeverity>;
/**
 * Helper function to get department by complaint type
 */
export declare function getDepartmentByComplaintType(complaintType: ComplaintType): GovernmentDepartment;
/**
 * Helper function to get default severity by complaint type
 */
export declare function getSeverityByComplaintType(complaintType: ComplaintType): ComplaintSeverity;
