# Image Upload Feature

This document explains how to use the UploadThing image upload feature for complaints.

## Setup

1. **Environment Variable**: Make sure you have `UPLOADTHING_API_KEY` in your `.env` file:
   ```
   UPLOADTHING_API_KEY=your_uploadthing_api_key_here
   ```

2. **Dependencies**: Already installed:
   - `uploadthing` - UploadThing SDK
   - `multer` - File upload middleware for Express

## API Usage

### Create Complaint with Image

**Endpoint**: `POST /api/complaints`

**Content-Type**: `multipart/form-data`

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

**Form Fields**:
- `image` (file, optional): Image file (max 4MB, jpg/png/gif/etc)
- `description` (string, required): Complaint description (max 2000 chars)
- `latitude` (number, required): Location latitude (-90 to 90)
- `longitude` (number, required): Location longitude (-180 to 180)
- `address` (string, optional): Human-readable address (max 500 chars)

### Example using cURL

```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "description=Pothole on Main Street" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060" \
  -F "address=123 Main St, New York, NY"
```

### Example using JavaScript/Fetch

```javascript
const formData = new FormData()
formData.append('image', fileInput.files[0])
formData.append('description', 'Pothole on Main Street')
formData.append('latitude', '40.7128')
formData.append('longitude', '-74.0060')
formData.append('address', '123 Main St, New York, NY')

const response = await fetch('http://localhost:5000/api/complaints', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})

const data = await response.json()
console.log('Complaint created:', data)
```

### Example using Axios

```javascript
import axios from 'axios'

const formData = new FormData()
formData.append('image', fileInput.files[0])
formData.append('description', 'Pothole on Main Street')
formData.append('latitude', '40.7128')
formData.append('longitude', '-74.0060')
formData.append('address', '123 Main St, New York, NY')

const response = await axios.post('http://localhost:5000/api/complaints', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
})

console.log('Complaint created:', response.data)
```

## Response

Success response (201 Created):
```json
{
  "status": "success",
  "message": "Complaint created successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "userId": "65f0987654321fedcba09876",
    "description": "Pothole on Main Street",
    "imageUrl": "https://utfs.io/f/abc123def456...",
    "location": {
      "type": "Point",
      "coordinates": [-74.0060, 40.7128],
      "address": "123 Main St, New York, NY"
    },
    "category": "OTHER",
    "severity": "MEDIUM",
    "department": "OTHER",
    "status": "PENDING",
    "createdAt": "2024-03-13T10:30:00.000Z",
    "updatedAt": "2024-03-13T10:30:00.000Z"
  }
}
```

## Image Requirements

- **Format**: jpg, jpeg, png, gif, webp
- **Max Size**: 4MB
- **Max Count**: 1 image per complaint

## Image Deletion

When a complaint is deleted, the associated image is automatically deleted from UploadThing to free up storage.

## UploadThing Direct Upload (Advanced)

If you want to use UploadThing's client-side upload (for better UX), you can also upload directly to:

**Endpoint**: `POST /api/uploadthing`

This endpoint is configured with the UploadThing Express adapter and provides:
- Direct browser uploads
- Progress tracking
- Better error handling

Refer to [UploadThing documentation](https://docs.uploadthing.com/) for client-side integration.

## Error Handling

### Common Errors

1. **File too large** (400):
   ```json
   {
     "status": "error",
     "message": "File too large"
   }
   ```

2. **Invalid file type** (400):
   ```json
   {
     "status": "error",
     "message": "Only image files are allowed"
   }
   ```

3. **Upload failed** (500):
   ```json
   {
     "status": "error",
     "message": "Failed to upload image"
   }
   ```

4. **API key not configured** (500):
   ```json
   {
     "status": "error",
     "message": "UploadThing API key not configured"
   }
   ```

## Testing

You can test the image upload without a frontend using Postman or Insomnia:

1. Create a new POST request to `http://localhost:5000/api/complaints`
2. Set Authorization header with your JWT token
3. Choose Body → form-data
4. Add fields:
   - `image` (File): Select an image file
   - `description` (Text): Enter description
   - `latitude` (Text): Enter latitude
   - `longitude` (Text): Enter longitude
   - `address` (Text, optional): Enter address
5. Send the request

## Implementation Details

### Files Modified/Created:

1. **`src/utils/uploadthing.ts`**: UploadThing router configuration
2. **`src/utils/uploadthing-helpers.ts`**: Helper functions for upload/delete
3. **`src/config/multer.ts`**: Multer configuration for file handling
4. **`src/controllers/complaint.controller.ts`**: Updated to handle image upload
5. **`src/routes/complaint.route.ts`**: Added multer middleware
6. **`src/server.ts`**: Added UploadThing routes
7. **`src/config/dotenv.ts`**: Already has UPLOADTHING_API_KEY export

### Workflow:

1. Client sends multipart/form-data request with image
2. Multer middleware parses the file and stores it in memory as Buffer
3. Controller extracts the file buffer from `req.file`
4. Image is uploaded to UploadThing using UTApi
5. UploadThing returns the image URL
6. URL is stored in MongoDB with complaint data
7. On complaint deletion, image is also deleted from UploadThing
