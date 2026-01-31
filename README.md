# MERN Dating & Matrimony App

> A full-featured dating and matrimony application built with the MERN stack, featuring real-time messaging, advanced matchmaking, and dual app modes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About the Project

A modern, feature-rich dating and matrimony platform that offers users two distinct modes of operation:
- **Dating Mode** - For casual connections and short-term relationships
- **Matrimony Mode** - For serious relationships and marriage-focused matching

The application provides a comprehensive user experience with real-time messaging, advanced filtering, location-based discovery, and social features like stories and groups.

### Key Highlights

- **Dual Authentication** - Email/mobile registration and Google OAuth 2.0
- **Real-Time Chat** - WebSocket-based messaging with Socket.IO
- **Smart Matchmaking** - Filter by interests, location, qualification, and preferences
- **Privacy Controls** - Granular privacy settings and profile visibility controls
- **Cloud Storage** - Cloudinary integration for images and videos
- **Responsive Design** - Mobile-first UI with Bootstrap 5
- **Social Features** - Stories, groups, notifications, and profile visits

### Screenshots

_Coming soon - Add your app screenshots here_

---

## Features

### Authentication & Onboarding

- User registration with email/mobile and password
- Google OAuth 2.0 integration for seamless login
- JWT-based authentication with 5-hour token expiry
- Multi-step onboarding flow:
  - Personal details collection
  - Profile image/video upload
  - Employment status
  - Relationship goals
  - App mode selection (Dating/Matrimony)
  - Interest and gender preference setup

### User Discovery

- Browse all profiles with gender-based filtering
- Location-based user discovery ("Near by users")
- Filter profiles by qualification
- Instagram-style stories feature
- Track who viewed your profile
- Profile visit history

### Connection Management

- Send and receive friend/connection requests
- Accept or reject incoming requests
- View sent, received, accepted, and rejected requests
- Cancel sent requests
- Shortlist favorite profiles
- See who shortlisted you
- Track all contacted users

### Real-Time Messaging

- One-on-one chat with accepted connections
- WebSocket-based real-time communication
- Send text messages and image attachments
- Message read/unread status tracking
- Online status indicators
- Conversation history with timestamps
- Image preview in chat

### Premium Features

- Multiple subscription plans
- Payment method management
- Credit card integration (Visa, Mastercard, American Express, Discover)
- Upgrade prompts and feature gating

### Social Features

- Create and join groups
- Share and view stories
- Notification system
- Profile likes and interactions

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI library |
| React Router DOM | 6.26.1 | Client-side routing |
| Socket.io-client | 4.7.5 | Real-time messaging client |
| Axios | 1.7.4 | HTTP client for API calls |
| Bootstrap | 5.3.3 | CSS framework |
| React Bootstrap | 2.10.4 | Bootstrap components for React |
| FontAwesome | 6.6.0 | Icon library |
| React Icons | 5.2.1 | Additional icons |
| React Spinners | 0.14.1 | Loading animations |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 4.19.2 | Web framework |
| Mongoose | 8.5.3 | MongoDB ODM |
| Socket.IO | 4.7.5 | WebSocket server |
| Passport | 0.7.0 | Authentication middleware |
| Passport-Google-OAuth20 | 2.0.0 | Google OAuth strategy |
| JWT | 9.0.2 | Token generation/verification |
| Bcrypt | 5.1.1 | Password hashing |
| Cloudinary | 1.41.3 | Cloud storage for media |
| Multer | 1.4.5-lts.1 | File upload handling |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Express-session | 1.18.0 | Session management |

### Database

- **MongoDB** - NoSQL database for all application data

### Development Tools

- Nodemon - Backend auto-restart
- Create React App - Frontend build tool
- ESLint - Code linting

---

## Architecture

### High-Level Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│    MongoDB      │
│  (Port 3000)    │         │  (Port 4000)    │         │   Database      │
│                 │         │                 │         │                 │
└────────┬────────┘         └────────┬────────┘         └─────────────────┘
         │                           │
         │    WebSocket (Socket.IO)  │
         └───────────────────────────┘
                Real-time Chat

         ┌─────────────────┐
         │                 │
         │   Cloudinary    │
         │  Media Storage  │
         │                 │
         └─────────────────┘
```

### Frontend Architecture

**Pattern:** Component-based architecture with CSS Modules

**Structure:**
- **Components Layer** (26 components) - Reusable UI components
  - Header, Footer, Navigation
  - Profile cards and views
  - Modals and settings
  - Stories and social features
- **Pages Layer** (30 pages) - Route-specific page components
  - Authentication and onboarding
  - User discovery and matching
  - Connection management
  - Messaging and chat
- **Services Layer** (21 API services) - API integration
  - Clean separation of API logic
  - Centralized HTTP client configuration
  - Token-based authentication
- **State Management** - React Context API
  - UserContext for authentication state
  - ModalContext for UI state

### Backend Architecture

**Pattern:** MVC (Model-View-Controller)

**Structure:**
- **Models Layer** (7 models) - MongoDB schemas
  - User, ProfileDetails, FriendRequest
  - Message, ShortList, ProfileVisit, JobStatus
- **Controllers Layer** - Business logic
  - Authentication, profile management
  - Request handling, messaging
- **Routes Layer** - API endpoint definitions
- **Middleware** - Authentication, error handling
- **Config** - Database, OAuth, Cloudinary setup
- **Real-time** - Socket.IO for chat

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 14.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** - Package manager (comes with Node.js)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Cloudinary Account** - For image/video storage ([Sign up](https://cloudinary.com/))
- **Google OAuth Credentials** (Optional) - For Google login ([Google Console](https://console.cloud.google.com/))

### Verify Installation

```bash
node --version  # Should be v14.x or higher
npm --version   # Should be 6.x or higher
mongo --version # Or verify MongoDB Atlas connection
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd MERN-dating-App
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section below)
# Add all required environment variables

# Start the backend server
npm start
# Or for development with auto-restart:
nodemon
```

The backend server will start on `http://localhost:4000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd new_design

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_SERVER_URL=http://localhost:4000" > .env

# Start the React development server
npm start
```

The frontend application will open at `http://localhost:3000`

### 4. Database Setup

**Option 1: Local MongoDB**
```bash
# Start MongoDB service
mongod

# MongoDB will create the database automatically on first connection
```

**Option 2: MongoDB Atlas**
```bash
# Create a cluster on MongoDB Atlas
# Get your connection string
# Add it to backend/.env as MONGO_URI
```

The database collections will be created automatically when the application runs for the first time.

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/dating_app
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dating_app

# JWT Secret
JWT_SECRET_KEY=your_super_secret_jwt_key_here_change_this

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Server Port (optional)
PORT=4000
```

### Frontend Environment Variables

Create a `.env` file in the `new_design` directory:

```env
# Backend API URL
REACT_APP_SERVER_URL=http://localhost:4000
```

### Getting Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
6. Copy Client ID and Client Secret

---

## Project Structure

### Backend Structure

```
backend/
├── config/                          # Configuration files
│   ├── db.js                       # MongoDB connection
│   ├── passport.js                 # Google OAuth strategy
│   ├── Cloudinary.js               # Profile media upload config
│   └── ChatImageCloudinary.js      # Chat image upload config
│
├── Controllers/                     # Business logic controllers
│   ├── AuthController.js
│   ├── ProfileController.js
│   ├── FriendRequestController.js
│   ├── MessageController.js
│   └── ... (20+ controllers)
│
├── Models/                          # Database schemas
│   ├── User.js                     # User authentication & profile
│   ├── ProfileDetails.js           # Extended profile information
│   ├── FriendRequest.js            # Connection requests
│   ├── Message.js                  # Chat messages
│   ├── ShortList.js                # Saved/favorited profiles
│   ├── ProfileVisit.js             # Profile view tracking
│   └── jobStatus.js                # Employment information
│
├── Middleware/                      # Custom middleware
│   └── Authentication.js           # JWT verification middleware
│
├── Routes/                          # API route definitions
│   └── UserRoutes.js               # All user-related routes
│
├── index.js                         # Application entry point
├── package.json                     # Dependencies and scripts
└── .env                            # Environment variables
```

### Frontend Structure

```
new_design/
├── public/                          # Static files
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/                     # Images, SVGs, icons
│   │
│   ├── Components/                 # Reusable components (26 total)
│   │   ├── ChangePassword/
│   │   ├── Context/                # React Context providers
│   │   │   └── UserContext.js
│   │   ├── Discover/
│   │   ├── EditMyProfile/
│   │   ├── Filters/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── HeaderUserHome/
│   │   ├── InterestModal/
│   │   ├── LeftSideMenu/
│   │   ├── LikeAndConnect/
│   │   ├── LoadingPage/
│   │   ├── NavProfileView/
│   │   ├── Notifications/
│   │   ├── OwnProfileView/
│   │   ├── PaymentMethods/
│   │   ├── PrivacySettings/
│   │   ├── ProfileCard/
│   │   ├── Profiles/
│   │   ├── ProfileView/
│   │   ├── RightSideModal/
│   │   ├── Settings/
│   │   ├── Stories/
│   │   ├── UpgradeModal/
│   │   ├── UpgradeView/
│   │   └── viewStory/
│   │
│   ├── Pages/                      # Page components (30 total)
│   │   ├── Accepted/               # Accepted requests
│   │   ├── AddCard/                # Add payment method
│   │   ├── ChooseApp/              # Dating/Matrimony selection
│   │   ├── Contacted/              # Contacted users
│   │   ├── CreateGroup/            # Group creation
│   │   ├── Designation/            # Job designation setup
│   │   ├── Groups/                 # Groups list
│   │   ├── JobStatus/              # Employment status
│   │   ├── LandingPage/            # Login/Signup
│   │   ├── Location/               # Location setup
│   │   ├── Matches/                # User matches
│   │   ├── Messages/               # Messages list
│   │   ├── NearByUser/             # Location-based discovery
│   │   ├── NotFound403/            # Forbidden error
│   │   ├── NotFound404/            # Not found error
│   │   ├── Notifaction/            # Notifications
│   │   ├── PersonalDetail_page/    # Personal details form
│   │   ├── PersonalMessasges/      # One-on-one chat
│   │   ├── Qualification/          # Education details
│   │   ├── Received/               # Received requests
│   │   ├── Rejected/               # Rejected requests
│   │   ├── RelationShipGoals/      # Relationship preferences
│   │   ├── Sent/                   # Sent requests
│   │   ├── Shortlisted/            # Shortlisted profiles
│   │   ├── ShortlistedBy/          # Who shortlisted you
│   │   ├── SubscriptionPlan/       # Premium plans
│   │   ├── UpgradePopup/           # Upgrade modal
│   │   ├── UserHome/               # Main dashboard
│   │   └── ViewedMyProfile/        # Profile visitors
│   │
│   ├── Services/                   # API integration (21 services)
│   │   ├── authServices.js
│   │   ├── FriendRequestAPI.js
│   │   ├── ReceivedRequestAPI.js
│   │   ├── ShortListAPI.js
│   │   ├── PersonalDetails.js
│   │   ├── ParentMessageAPI.js
│   │   ├── PersonalMessageAPI.js
│   │   ├── chattingImagesAPI.js
│   │   └── ... (13+ more services)
│   │
│   ├── StateManagement/            # Global state
│   │   └── ModalContext.jsx
│   │
│   ├── App.jsx                     # Main routing config
│   └── index.jsx                   # Application entry point
│
├── package.json                     # Dependencies
└── .env                            # Environment variables
```

---

## API Documentation

### Base URL

```
http://localhost:4000
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

### Authentication Endpoints

#### Register User

```http
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": 1234567890,
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Authentication Required:** No

---

#### Login User

```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Authentication Required:** No

---

#### Google OAuth Login

```http
GET /auth/google
```

Redirects to Google OAuth consent screen.

**Authentication Required:** No

---

#### Google OAuth Callback

```http
GET /auth/google/callback
```

Handles Google OAuth callback and redirects to frontend with token.

**Authentication Required:** No

---

### Profile Management Endpoints

#### Upload Profile Media

```http
POST /users/upload
```

**Request:** Multipart form data with images/videos

**Response:**
```json
{
  "message": "Files uploaded successfully",
  "imageUrls": ["url1", "url2"],
  "videoUrl": "url3"
}
```

**Authentication Required:** Yes

---

#### Create Profile Details

```http
POST /users/profileDetails
```

**Request Body:**
```json
{
  "age": 28,
  "dateofbirth": "1995-05-15",
  "hobbies": ["reading", "traveling"],
  "interest": ["movies", "music"],
  "smokingHabits": "non-smoker",
  "drinkingHabits": "social",
  "qualification": "Masters",
  "profile_image_urls": ["url1", "url2"],
  "bio": "Software engineer looking for meaningful connections",
  "gender": "male",
  "location": {
    "lat": 40.7128,
    "lon": -74.0060,
    "name": "New York, NY"
  }
}
```

**Authentication Required:** Yes

---

#### Get Current User

```http
GET /users/me
```

**Response:**
```json
{
  "user": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "profile": {...}
  }
}
```

**Authentication Required:** Yes

---

#### Get Profile Details

```http
GET /users/get-profile?profileId=60d5ec49f1b2c8b1f8e4e1a1
```

**Response:**
```json
{
  "profile": {
    "userId": "60d5ec49f1b2c8b1f8e4e1a1",
    "age": 28,
    "bio": "Software engineer...",
    "hobbies": ["reading", "traveling"],
    ...
  }
}
```

**Authentication Required:** Yes

---

#### Edit Profile

```http
POST /users/edit-profile
```

**Request Body:** Same as profile creation with updated fields

**Authentication Required:** Yes

---

#### Change Password

```http
POST /users/edit-password
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Authentication Required:** Yes

---

### User Discovery Endpoints

#### Get All Users

```http
GET /users/fetch-allusers
```

Returns all users filtered by current user's gender preference.

**Response:**
```json
{
  "users": [
    {
      "_id": "...",
      "name": "Jane Smith",
      "profile": {...}
    }
  ]
}
```

**Authentication Required:** Yes

---

#### Filter by Qualification

```http
GET /users/get-filterQualification?qualification=Masters
```

**Authentication Required:** Yes

---

#### Get Profile Visitors

```http
GET /users/getVisit-profiles
```

Returns users who viewed your profile.

**Authentication Required:** Yes

---

### Friend Request Endpoints

#### Send Friend Request

```http
POST /users/sent-friendRequest
```

**Request Body:**
```json
{
  "receiverId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Authentication Required:** Yes

---

#### Get Sent Requests

```http
GET /users/get-sentRequest
```

Returns all friend requests sent by current user.

**Authentication Required:** Yes

---

#### Cancel Sent Request

```http
POST /users/remove-sentRequest
```

**Request Body:**
```json
{
  "receiverId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Authentication Required:** Yes

---

#### Get Received Requests

```http
GET /users/get-receivedRequest
```

Returns all friend requests received by current user.

**Authentication Required:** Yes

---

#### Accept Request

```http
POST /users/accept-request
```

**Request Body:**
```json
{
  "senderId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Authentication Required:** Yes

---

#### Reject Request

```http
POST /users/reject-request
```

**Request Body:**
```json
{
  "senderId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Authentication Required:** Yes

---

#### Get Rejected Requests

```http
GET /users/get-rejectedRequest
```

**Authentication Required:** Yes

---

#### Get Accepted Requests

```http
GET /users/get-acceptedRequest
```

**Authentication Required:** Yes

---

### Shortlist Endpoints

#### Add to Shortlist

```http
POST /users/shortList
```

**Request Body:**
```json
{
  "shortListedUserId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Authentication Required:** Yes

---

#### Get Shortlisted Profiles

```http
GET /users/get-shortlisted
```

Returns profiles you shortlisted.

**Authentication Required:** Yes

---

#### Get Shortlisted By

```http
GET /users/get-shortlistedBy
```

Returns users who shortlisted your profile.

**Authentication Required:** Yes

---

#### Remove from Shortlist

```http
POST /users/remove-shortlist
```

**Request Body:**
```json
{
  "shortListedUserId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Authentication Required:** Yes

---

### Onboarding Endpoints

#### Set Job Status

```http
POST /users/job-status
```

**Request Body:**
```json
{
  "type": "employer",
  "companyName": "Tech Corp",
  "designation": "Senior Developer",
  "location": "New York, NY"
}
```

Or for job seekers:
```json
{
  "type": "jobSeeker",
  "jobTitle": "Software Engineer",
  "expertiseLevel": "Senior"
}
```

**Authentication Required:** Yes

---

#### Set Relationship Goals

```http
POST /users/relation-status
```

**Request Body:**
```json
{
  "relationShipGoal": "longTerm"
}
```

Values: `"shortTerm"` or `"longTerm"`

**Authentication Required:** Yes

---

#### Choose App Mode

```http
POST /users/choose-app
```

**Request Body:**
```json
{
  "chooseApp": "Dating"
}
```

Values: `"Dating"` or `"Matrimony"`

**Authentication Required:** Yes

---

#### Set User Interest

```http
POST /users/userInterest
```

**Request Body:**
```json
{
  "userInterest": "WOMEN"
}
```

Values: `"MEN"`, `"WOMEN"`, or `"BOTH"`

**Authentication Required:** Yes

---

### Messaging Endpoints

#### Get Friends for Messaging

```http
GET /users/message-acceptedRequests
```

Returns all accepted connections available for messaging.

**Authentication Required:** Yes

---

#### Get Message Profile

```http
GET /users/get-personalMessage-Profile?profileId=60d5ec49f1b2c8b1f8e4e1a1
```

Returns profile details for messaging view.

**Authentication Required:** Yes

---

#### Upload Chat Image

```http
POST /users/chatImage-upload
```

**Request:** Multipart form data with image

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://cloudinary.com/..."
}
```

**Authentication Required:** Yes

---

### Socket.IO Events

The application uses Socket.IO for real-time messaging on `ws://localhost:4000`

#### Client Events (Emit)

**Register User Socket**
```javascript
socket.emit('register', userId)
```

**Load Conversation**
```javascript
socket.emit('load conversation', {
  senderId: "user1_id",
  receiverId: "user2_id"
})
```

**Send Message**
```javascript
socket.emit('sendMessage', {
  senderId: "user1_id",
  receiverId: "user2_id",
  text: "Hello!",
  attachments: []
})
```

#### Server Events (Listen)

**Load Previous Messages**
```javascript
socket.on('load previous messages', (messages) => {
  // Array of message objects
})
```

**Receive Chat Message**
```javascript
socket.on('chat message', (message) => {
  // New message object
})
```

**Disconnect**
```javascript
socket.on('disconnect', () => {
  // Handle disconnection
})
```

---

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  mobile: Number (unique),
  password: String (hashed),
  googleId: String,
  photo: String,
  token: String,
  profile: ObjectId (ref: ProfileDetails),
  employer: ObjectId (ref: JobStatus),
  relationShipGoal: Enum ['shortTerm', 'longTerm'],
  chooseApp: Enum ['Dating', 'Matrimony'],
  userInterest: Enum ['MEN', 'WOMEN', 'BOTH'],
  username: String,
  createdAt: Date
}
```

### ProfileDetails Model

```javascript
{
  userId: ObjectId (ref: User),
  email: String (unique),
  age: Number,
  dateofbirth: Date,
  hobbies: [String],
  interest: [String],
  smokingHabits: String,
  drinkingHabits: String,
  qualification: String,
  profile_image_urls: [String],
  profile_video_urls: String,
  bio: String,
  gender: String,
  location: {
    lat: Number,
    lon: Number,
    name: String
  }
}
```

### FriendRequest Model

```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  status: Enum ['pending', 'accepted', 'rejected'],
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model

```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  text: String,
  isRead: Boolean,
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### ShortList Model

```javascript
{
  userId: ObjectId (ref: User),
  shortListedUserId: ObjectId (ref: User),
  createdAt: Date
}
```

### ProfileVisit Model

```javascript
{
  ownerId: ObjectId (ref: User),
  viewerId: ObjectId (ref: User),
  ownerEmail: String,
  viewDate: Date
}
```

### JobStatus Model

```javascript
{
  userId: ObjectId (ref: User),
  email: String,
  type: Enum ['employer', 'jobSeeker'],
  companyName: String,
  designation: String,
  location: String,
  jobTitle: String,
  expertiseLevel: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage

### Getting Started

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:4000`

2. **Start the Frontend Application**
   ```bash
   cd new_design
   npm start
   ```
   App opens at `http://localhost:3000`

3. **Create Your Account**
   - Navigate to `http://localhost:3000`
   - Click "Sign Up" and enter your details
   - Or use "Continue with Google" for quick registration

4. **Complete Your Profile**
   - Upload profile pictures/videos
   - Fill in personal details (age, bio, interests)
   - Set employment status
   - Choose relationship goals
   - Select app mode (Dating or Matrimony)
   - Set gender preferences

5. **Start Exploring**
   - Browse user profiles on the home page
   - Use filters to find matches
   - Send connection requests
   - Accept incoming requests
   - Start chatting with your matches

### Common Workflows

**Sending a Connection Request:**
1. Browse profiles or search for users
2. Click on a profile to view details
3. Click "Send Request" button
4. Wait for the other user to accept

**Starting a Conversation:**
1. Go to "Messages" page
2. View your accepted connections
3. Click on a user to open chat
4. Send text messages or images
5. Messages are delivered in real-time

**Managing Privacy:**
1. Go to Settings
2. Click Privacy Settings
3. Configure profile visibility
4. Set who can message you

---

## Contributing

Contributions are welcome! Here's how you can help:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Follow existing code structure and naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use CSS Modules for component styling
- Write clean, readable code

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Describe your changes clearly in the PR
4. Link any related issues
5. Wait for code review

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For questions, suggestions, or support:

- **Email:** your.email@example.com
- **GitHub Issues:** [Create an issue](https://github.com/yourusername/MERN-dating-App/issues)
- **LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

## Acknowledgments

- [React Documentation](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.IO](https://socket.io/)
- [Cloudinary](https://cloudinary.com/)
- [Bootstrap](https://getbootstrap.com/)
- [FontAwesome](https://fontawesome.com/)

---

**Built with ❤️ using the MERN Stack**

[Back to Top](#mern-dating--matrimony-app)
