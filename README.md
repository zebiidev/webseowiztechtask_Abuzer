# Webseowiz Task

This repository contains a simple idea board app with two parts:

- Frontend: a Next.js app for submitting and viewing ideas
- Backend: an Express + TypeScript API that stores ideas in MongoDB and can upload images to Cloudinary

## Project Structure

- webseowiztask/ - Next.js frontend
- backend/ - Express/TypeScript API server

## Tech Stack

### Frontend

The frontend uses:

- Next.js for the React app framework
- React and React DOM for the UI
- Tailwind CSS for styling
- TypeScript for type safety
- ESLint for linting

### Backend

The backend uses:

- Express for the HTTP server
- CORS for browser cross-origin requests
- Multer for handling file uploads
- Cloudinary for image storage
- Mongoose for MongoDB interaction
- Zod for input validation
- Dotenv for environment variables
- Swagger JSDoc + Swagger UI for API documentation
- TypeScript, ts-node, and tsx for TypeScript execution

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ recommended
- npm
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account for image uploads (optional but recommended)

## Environment Variables

Create a .env file inside the backend folder with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The backend will throw an error if MONGO_URI is missing.

## Installation

Install dependencies separately for each part of the project:

```bash
cd backend
npm install
```

```bash
cd ../webseowiztask
npm install
```

## Running the Project

### 1) Start the backend

```bash
cd backend
npm run dev
```

The API will run at:

- http://localhost:5000
- Swagger docs: http://localhost:5000/api-docs

### 2) Start the frontend

In a second terminal:

```bash
cd webseowiztask
npm run dev
```

The frontend will run at:

- http://localhost:3000

If your backend is hosted on a different port or domain, set this environment variable in the frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Endpoints

### Health Check

- GET /health
- Returns a simple JSON object showing the server is online

### Get All Ideas

- GET /ideas
- GET /api/ideas
- Returns all ideas sorted from newest to oldest

### Create an Idea

- POST /ideas
- POST /api/ideas
- Accepts form-data with:
  - title: required string
  - description: optional string
  - image: optional file upload

### API Documentation

- GET /api-docs
- Opens Swagger UI for testing the API endpoints

## Useful Commands

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd webseowiztask
npm run build
npm start
```

## Notes

- The frontend sends requests to /api/ideas by default.
- Images are uploaded to Cloudinary only if the Cloudinary credentials are configured.
- If you do not want image upload support, the app can still create ideas without an image.
