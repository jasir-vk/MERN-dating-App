# MERN Dating App

A full-stack dating and matchmaking application built on the MERN stack. Users create rich profiles, discover people nearby, exchange friend requests, shortlist profiles, and chat in real time once matched.

---

## Features

### Profiles & Onboarding
- Multi-step profile setup: personal details, qualification, designation, location and relationship goals
- Profile photo uploads stored on Cloudinary
- Edit profile and change password flows
- Job status and interests on each profile

### Discovery & Matching
- Browse all profiles and nearby users
- Send, accept, reject and withdraw friend requests
- Shortlist profiles — and see who shortlisted you
- Profile visit tracking ("Viewed my profile")
- Filter profiles by qualification

### Messaging
- Real-time one-to-one chat between matched users, powered by Socket.io
- Image sharing inside chats
- Groups and notifications

### Accounts & Monetisation
- Email/password registration with JWT authentication (bcrypt-hashed passwords)
- Google sign-in via Passport (OAuth 2.0)
- Subscription plans with upgrade prompts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Create React App) + Bootstrap / React-Bootstrap |
| Routing | React Router |
| Real-time | Socket.io (client + server) |
| Backend | Node.js + Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt, Passport (Google OAuth 2.0) |
| Media Storage | Cloudinary + Multer |

---

## Project Structure

```
├── backend/            # Express API
│   ├── config/         # DB and passport configuration
│   ├── Controllers/    # Route handlers
│   ├── Middleware/     # Auth middleware
│   ├── Models/         # User, ProfileDetails, Message, FriendRequest,
│   │                   # ShortList, ProfileVisit, JobStatus
│   ├── Routes/         # /api user routes
│   └── index.js        # Server entry point
└── new_design/         # React frontend
    └── src/
        ├── Components/
        ├── Pages/      # Matches, Messages, NearByUser, Shortlisted, ...
        ├── Services/   # API layer
        └── StateManagement/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)
- Cloudinary account (media uploads)
- Google OAuth credentials (optional, for Google sign-in)

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Start the API:

```bash
npm start
```

### 2. Frontend

```bash
cd new_design
npm install
npm start
```

The app runs at `http://localhost:3000` and talks to the Express API.

---

## API Overview

All routes are JWT-protected except register/login.

| Area | Endpoints |
|------|-----------|
| Auth | `POST /register`, `POST /login`, `GET /me` |
| Profile | `POST /profileDetails`, `POST /edit-profile`, `POST /edit-password`, `POST /upload` |
| Requests | `POST /sent-friendRequest`, `POST /accept-request`, `POST /reject-request`, `GET /get-sentRequest`, `GET /get-receivedRequest` |
| Shortlist | `POST /shortList`, `GET /get-shortlisted`, `GET /get-shortlistedBy` |
| Discovery | `GET /fetch-allusers`, `GET /get-profile`, `GET /getVisit-profiles`, `GET /get-filterQualification` |
| Chat | `GET /get-personalMessage-Profile`, `GET /message-acceptedRequests`, `POST /chatImage-upload` + Socket.io events |

---

## Author

**Jasir VK** — [github.com/jasir-vk](https://github.com/jasir-vk) · [linkedin.com/in/jasirvk](https://www.linkedin.com/in/jasirvk)
