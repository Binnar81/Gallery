# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier available)

## 1. Install Dependencies
```bash
npm run install-all
```

## 2. Environment Setup

### Backend (.env file in backend directory)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gallery-mern
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

### Cloudinary Setup
1. Sign up at https://cloudinary.com/
2. Get credentials from Dashboard
3. Update the Cloudinary environment variables

## 3. Start Development Servers
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 4. Usage
1. Open http://localhost:3000
2. Sign up for a new account
3. Upload images using drag & drop
4. View and manage your gallery

## Features
- ✅ User authentication (signup/login)
- ✅ Image upload with drag & drop
- ✅ Image gallery with grid layout
- ✅ Image metadata display
- ✅ Delete images
- ✅ Responsive design
- ✅ Loading states and error handling 