# Brainly Backend API

A simple Node.js + Express + TypeScript backend for saving, sharing, and managing links/content with user authentication.

## Features
- User signup & signin (JWT authentication)
- Save and retrieve content (links, titles)
- Share your content with a unique link
- MongoDB database (Mongoose)

## Tech Stack
- Node.js, Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT, bcrypt, Zod

## Getting Started
1. Clone the repo
2. Install dependencies: `npm install`
3. Add a `.env` file with your `MONGO_URL` and `JWT_SECRET`
4. Build: `npm run build`
5. Start: `npm start`

## API Endpoints
- `POST /api/v1/signup` — Register
- `POST /api/v1/signin` — Login
- `POST /api/v1/content` — Add content (auth required)
- `GET /api/v1/content` — Get your content (auth required)
- `DELETE /api/v1/delete` — Delete content (auth required)
- `POST /api/v1/share` — Enable/disable sharing (auth required)
- `GET /api/v1/brain/:shareLink` — View shared content

---
