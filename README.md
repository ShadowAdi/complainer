# 🚨 AI-Based Local Governance Complaint Redressal System

A smart complaint management system for local authorities in India that uses AI to automatically classify, prioritize, and assign complaints to the appropriate government departments.

## 🌟 Features

- **Smart Complaint Submission**: Accept text and/or image complaints
- **AI Classification**: Automatically classify complaint type, severity, and department using Sarvam AI & OpenRouter
- **Image Upload**: Store complaint images on UploadThing CDN
- **Priority Assignment**: AI-based severity assessment (Low/Medium/High)
- **Department Routing**: Auto-assign complaints to relevant government departments
- **Status Tracking**: Track complaint lifecycle (Pending → In Progress → Resolved)
- **User Management**: Separate user and admin roles with appropriate permissions
- **Location Tracking**: GeoJSON-based location storage for complaints

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **AI**: Sarvam AI & OpenRouter (DeepSeek) with fallback
- **Image Storage**: UploadThing CDN
- **File Upload**: Multer middleware
- **Authentication**: JWT-based auth
- **Validation**: Express Validator
- **Logging**: Winston

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **pnpm** package manager (`npm install -g pnpm`)
- API Keys for:
  - **Sarvam AI** (for complaint classification)
  - **OpenRouter** (backup AI provider)
  - **UploadThing** (for image storage)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/complainer.git
cd complainer
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_URL=mongodb://localhost:27017/complainer
# Or use MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/complainer

# JWT Secret (generate a strong secret)
JWT_SECRET_KEY=your-super-secret-jwt-key-here

# AI API Keys
SARVAM_API_KEY=your-sarvam-api-key-here
OPENROUTER_API_KEY=your-openrouter-api-key-here

# Image Upload
UPLOADTHING_API_KEY=your-uploadthing-api-key-here

# CORS (optional)
CLIENT_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# The app will automatically connect when started
```

### 5. Build and Run

```bash
# Development mode (with hot reload)
pnpm dev

# Production build
pnpm build
pnpm start
```

The server will start on `http://localhost:5000`

## 🔑 API Keys Setup

### Sarvam AI
1. Visit [Sarvam AI Console](https://console.sarvam.ai)
2. Create account and get API key
3. Add to `.env` as `SARVAM_API_KEY`

### OpenRouter (Backup AI)
1. Visit [OpenRouter](https://openrouter.ai)
2. Create account and get API key
3. Add to `.env` as `OPENROUTER_API_KEY`

### UploadThing (Image Storage)
1. Visit [UploadThing](https://uploadthing.com)
2. Create project and get API key
3. Add to `.env` as `UPLOADTHING_API_KEY`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Complaints
- `POST /api/complaints` - Create complaint (with optional image)
- `GET /api/complaints` - Get user's complaints (or all for admin)
- `GET /api/complaints/:id` - Get specific complaint
- `PATCH /api/complaints/:id` - Update complaint status (admin only)
- `DELETE /api/complaints/:id` - Delete complaint

### Health Check
- `GET /api/health` - Server health status

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
Copy the `token` from response.

### 3. Create Complaint with Image
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@path/to/your/image.jpg" \
  -F "description=Pothole on Main Street causing traffic issues" \
  -F "latitude=28.6139" \
  -F "longitude=77.2090" \
  -F "address=New Delhi, India"
```

### 4. Get All Complaints
```bash
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 How It Works

1. **User submits complaint** with text/image and location
2. **AI analyzes** the complaint and determines:
   - Category (Road Damage, Water Issues, etc.)
   - Severity (Low, Medium, High)
   - Department (PWD, Water Supply, etc.)
3. **System stores** complaint with AI classification
4. **Admin can track** and update complaint status
5. **Users can monitor** their complaint progress

## 🏛️ Government Departments Supported

- Public Works Department (PWD)
- Water Supply Department
- Sanitation and Waste Management
- Electricity and Street Lights
- Drainage and Sewage Department
- Parks and Gardens Department
- Health and Hygiene Department
- Traffic and Transport Department
- Building and Construction Department
- Municipal Corporation Office
- Revenue Department

## 🔧 Development

### Project Structure
```
src/
├── config/           # Configuration files
├── constants/        # Enums and constants
├── controllers/      # Route handlers
├── interfaces/       # TypeScript interfaces
├── middlewares/      # Express middlewares
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── validations/     # Input validation
```

### Scripts
```bash
pnpm dev      # Development mode with hot reload
pnpm build    # Build TypeScript to JavaScript
pnpm start    # Run production build
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check DB_URL in .env file

2. **AI Classification Failing**
   - Verify API keys in .env
   - Check internet connection
   - Logs will show which AI provider failed

3. **Image Upload Not Working**
   - Verify UploadThing API key
   - Check image file size (max 4MB)
   - Ensure supported format (jpg, png, gif)

4. **Port Already in Use**
   - Change PORT in .env file
   - Or kill process using port 5000

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_URL=your-mongodb-atlas-connection-string
JWT_SECRET_KEY=super-secure-production-secret
# ... other API keys
```

### Deploy to Railway/Vercel/Heroku
1. Push to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy!

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 👥 Team

Built for AI-Based Local Governance Hackathon

---

**Happy Coding! 🎉**