# Complaint System Constants

This folder contains all constants, enums, and configurations for the AI-Based Local Governance Complaint Redressal System

## Files

### `complaint.constants.ts`
Contains all complaint-related enums and mappings for the Indian local governance system.

## Constants Overview

### 1. **Complaint Severity**
- `Low` - Minor issues, can be addressed in regular schedule
- `Medium` - Moderate priority, needs attention soon
- `High` - Critical issues, requires immediate attention

**Usage:**
```typescript
import { ComplaintSeverity, SEVERITY_LEVELS } from './constants'

const severity = ComplaintSeverity.HIGH
```

### 2. **Government Departments**
12 departments covering all aspects of Indian local governance:
- Water Supply Department
- Sanitation and Waste Management
- Public Works Department (PWD)
- Electricity and Street Lights
- Drainage and Sewage Department
- Parks and Gardens Department
- Health and Hygiene Department
- Traffic and Transport Department
- Building and Construction Department
- Municipal Corporation Office
- Revenue Department
- Other Department

**Usage:**
```typescript
import { GovernmentDepartment, DEPARTMENT_LIST } from './constants'

const dept = GovernmentDepartment.WATER_SUPPLY
```

### 3. **Complaint Types**
24 predefined complaint categories + "Other" option:
- Water-related: Water Logging, Water Shortage
- Sanitation: Garbage Collection, Illegal Dumping
- Roads: Potholes, Road Damage
- Infrastructure: Street Lights, Drainage, Sewage
- Safety: Open Manholes, Fallen Trees
- Pollution: Noise, Air
- And more...

**Usage:**
```typescript
import { ComplaintType, COMPLAINT_CATEGORIES } from './constants'

const type = ComplaintType.WATER_LOGGING
```

### 4. **Resolution Status**
7 status stages tracking complaint lifecycle:
- Pending → Acknowledged → In Progress → Under Review → Resolved → Closed
- Rejected (for invalid complaints)

**Usage:**
```typescript
import { ComplaintStatus, STATUS_WORKFLOW } from './constants'

const status = ComplaintStatus.PENDING
```

### 5. **Department-Complaint Mapping**
Maps which departments handle which complaint types.

**Usage:**
```typescript
import { DEPARTMENT_COMPLAINT_MAPPING, getDepartmentByComplaintType } from './constants'

const dept = getDepartmentByComplaintType(ComplaintType.ROAD_DAMAGE)
// Returns: GovernmentDepartment.PUBLIC_WORKS
```

### 6. **Severity Priority Mapping**
Default severity levels for each complaint type (used when AI fails).

**Usage:**
```typescript
import { COMPLAINT_SEVERITY_PRIORITY, getSeverityByComplaintType } from './constants'

const severity = getSeverityByComplaintType(ComplaintType.SEWAGE_OVERFLOW)
// Returns: ComplaintSeverity.HIGH
```

## Helper Functions

### `getDepartmentByComplaintType(complaintType)`
Returns the appropriate department for a given complaint type.

### `getSeverityByComplaintType(complaintType)`
Returns the default severity level for a given complaint type.

## AI Integration Notes

These constants are designed to work with the AI classification service:
- AI will classify complaints into one of the `ComplaintType` values
- AI will assign severity: `Low`, `Medium`, or `High`
- AI will suggest department from `GovernmentDepartment` enum
- If AI fails, fallback mappings are used

## Extending

To add new complaint types or departments:
1. Add to respective enum
2. Add to array export (e.g., `COMPLAINT_CATEGORIES`)
3. Update `DEPARTMENT_COMPLAINT_MAPPING`
4. Update `COMPLAINT_SEVERITY_PRIORITY`
