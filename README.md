# CareerForge AI

CareerForge AI is a full-stack placement preparation platform for students. It combines resume analysis, job description matching, AI-powered mock interviews, quizzes, and roadmap tracking in one app.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, Google Sign-In
- AI services: OpenRouter-based LLM calls for interview evaluation, quiz generation, and roadmap generation

## Features

- User signup, login, and Google authentication
- Profile management for authenticated users
- Resume upload and resume history
- Job description upload and resume vs JD comparison
- AI-generated learning roadmaps with progress tracking
- AI mock interviews with adaptive follow-up questions
- Quiz generation, quiz submission, and quiz history
- Dashboard with ATS score, interview score, skills, and roadmap progress

## Project Structure

```text
AI Placement Coach/
|-- client/    # React + Vite frontend
|-- server/    # Express + MongoDB backend
|-- README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- OpenRouter API key
- Google OAuth client ID for Google Sign-In

## Environment Variables

Create these files before running the app:

### `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
OPENROUTER_API_KEY=your_openrouter_api_key
APP_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Installation

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

## Run Locally

Open two terminals.

### Terminal 1: start the backend

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`.

### Terminal 2: start the frontend

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Available Scripts

### Backend

- `npm start` - start the Express server
- `npm run dev` - start the server with `nodemon`

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Resume

- `POST /api/resume/upload`
- `GET /api/resume/all`

### Job Description

- `POST /api/job/upload`
- `POST /api/job/compare`
- `GET /api/job/all`
- `GET /api/job/:id`

### Interview

- `GET /api/interview/dashboard`
- `POST /api/interview/start`
- `POST /api/interview/submit`
- `POST /api/interview/next-question`
- `GET /api/interview/history`
- `GET /api/interview/analytics`

### Roadmaps

- `POST /api/roadmap/create`
- `GET /api/roadmap/all`
- `GET /api/roadmap/stream/:stream`
- `GET /api/roadmap/:id`
- `PUT /api/roadmap/:roadmapId/progress`

### Quiz

- `POST /api/quiz/create`
- `POST /api/quiz/create-subject`
- `GET /api/quiz/history`
- `GET /api/quiz/:id`
- `POST /api/quiz/submit`

### Dashboard and Progress

- `GET /api/dashboard/summary`
- `POST /api/progress/update-topic`
- `GET /api/health`

## Notes

- The backend enables CORS for the configured `CLIENT_URL`, localhost origins, and Vercel preview domains.
- Several app features depend on AI responses, so valid OpenRouter credentials are required for full functionality.
- MongoDB connection retries are built into the backend startup flow.
