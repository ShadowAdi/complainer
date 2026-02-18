/**
 * Complaint Management System Constants
 * For AI-Based Local Governance Complaint Redressal System (India)
 */
/**
 * Complaint Severity Levels
 * Used for prioritizing complaints
 */
export var ComplaintSeverity;
(function (ComplaintSeverity) {
    ComplaintSeverity["LOW"] = "Low";
    ComplaintSeverity["MEDIUM"] = "Medium";
    ComplaintSeverity["HIGH"] = "High";
})(ComplaintSeverity || (ComplaintSeverity = {}));
export const SEVERITY_LEVELS = [
    ComplaintSeverity.LOW,
    ComplaintSeverity.MEDIUM,
    ComplaintSeverity.HIGH,
];
/**
 * Indian Local Government Departments
 * Departments responsible for different civic issues
 */
export var GovernmentDepartment;
(function (GovernmentDepartment) {
    GovernmentDepartment["WATER_SUPPLY"] = "Water Supply Department";
    GovernmentDepartment["SANITATION"] = "Sanitation and Waste Management";
    GovernmentDepartment["PUBLIC_WORKS"] = "Public Works Department (PWD)";
    GovernmentDepartment["ELECTRICITY"] = "Electricity and Street Lights";
    GovernmentDepartment["DRAINAGE"] = "Drainage and Sewage Department";
    GovernmentDepartment["PARKS_GARDENS"] = "Parks and Gardens Department";
    GovernmentDepartment["HEALTH_HYGIENE"] = "Health and Hygiene Department";
    GovernmentDepartment["TRAFFIC_TRANSPORT"] = "Traffic and Transport Department";
    GovernmentDepartment["BUILDING_CONSTRUCTION"] = "Building and Construction Department";
    GovernmentDepartment["MUNICIPAL_CORPORATION"] = "Municipal Corporation Office";
    GovernmentDepartment["REVENUE"] = "Revenue Department";
    GovernmentDepartment["OTHER"] = "Other Department";
})(GovernmentDepartment || (GovernmentDepartment = {}));
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
];
/**
 * Complaint Types/Categories
 * Common civic issues in Indian local governance
 */
export var ComplaintType;
(function (ComplaintType) {
    ComplaintType["WATER_LOGGING"] = "Water Logging/Flooding";
    ComplaintType["WATER_SHORTAGE"] = "Water Shortage/No Supply";
    ComplaintType["GARBAGE_COLLECTION"] = "Garbage Collection Issue";
    ComplaintType["GARBAGE_DUMPING"] = "Illegal Garbage Dumping";
    ComplaintType["ROAD_DAMAGE"] = "Road Damage/Potholes";
    ComplaintType["ROAD_CONSTRUCTION"] = "Road Construction Issue";
    ComplaintType["STREET_LIGHT"] = "Street Light Not Working";
    ComplaintType["DRAINAGE_BLOCKAGE"] = "Drainage Blockage/Overflow";
    ComplaintType["SEWAGE_OVERFLOW"] = "Sewage Overflow";
    ComplaintType["ILLEGAL_CONSTRUCTION"] = "Illegal Construction";
    ComplaintType["ENCROACHMENT"] = "Encroachment on Public Property";
    ComplaintType["NOISE_POLLUTION"] = "Noise Pollution";
    ComplaintType["AIR_POLLUTION"] = "Air Pollution";
    ComplaintType["STRAY_ANIMALS"] = "Stray Animals Issue";
    ComplaintType["TREE_FALLEN"] = "Fallen Tree/Branch";
    ComplaintType["PARK_MAINTENANCE"] = "Park Maintenance Issue";
    ComplaintType["PUBLIC_TOILET"] = "Public Toilet Issue";
    ComplaintType["TRAFFIC_SIGNAL"] = "Traffic Signal Not Working";
    ComplaintType["TRAFFIC_CONGESTION"] = "Traffic Congestion";
    ComplaintType["ILLEGAL_PARKING"] = "Illegal Parking";
    ComplaintType["POWER_OUTAGE"] = "Power Outage";
    ComplaintType["MOSQUITO_BREEDING"] = "Mosquito Breeding/Fogging Required";
    ComplaintType["MANHOLE_OPEN"] = "Open Manhole/Safety Hazard";
    ComplaintType["OTHER"] = "Other";
})(ComplaintType || (ComplaintType = {}));
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
];
/**
 * Complaint Resolution Status
 * Tracks the lifecycle of a complaint
 */
export var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["PENDING"] = "Pending";
    ComplaintStatus["ACKNOWLEDGED"] = "Acknowledged";
    ComplaintStatus["IN_PROGRESS"] = "In Progress";
    ComplaintStatus["UNDER_REVIEW"] = "Under Review";
    ComplaintStatus["RESOLVED"] = "Resolved";
    ComplaintStatus["CLOSED"] = "Closed";
    ComplaintStatus["REJECTED"] = "Rejected";
})(ComplaintStatus || (ComplaintStatus = {}));
export const STATUS_WORKFLOW = [
    ComplaintStatus.PENDING,
    ComplaintStatus.ACKNOWLEDGED,
    ComplaintStatus.IN_PROGRESS,
    ComplaintStatus.UNDER_REVIEW,
    ComplaintStatus.RESOLVED,
    ComplaintStatus.CLOSED,
    ComplaintStatus.REJECTED,
];
/**
 * Department to Complaint Type Mapping
 * Helper mapping for AI classification
 */
export const DEPARTMENT_COMPLAINT_MAPPING = {
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
};
/**
 * Severity Priority Mapping
 * Helps in determining severity based on complaint type
 */
export const COMPLAINT_SEVERITY_PRIORITY = {
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
};
/**
 * Helper function to get department by complaint type
 */
export function getDepartmentByComplaintType(complaintType) {
    for (const [department, types] of Object.entries(DEPARTMENT_COMPLAINT_MAPPING)) {
        if (types.includes(complaintType)) {
            return department;
        }
    }
    return GovernmentDepartment.OTHER;
}
/**
 * Helper function to get default severity by complaint type
 */
export function getSeverityByComplaintType(complaintType) {
    return (COMPLAINT_SEVERITY_PRIORITY[complaintType] || ComplaintSeverity.MEDIUM);
}
//# sourceMappingURL=complaint.constants.js.map