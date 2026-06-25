# Media-Cloud-Platform

A cloud-based media management platform supporting video-to-podcast conversion, AI summarization, and secure file sharing.

---

## High Level Design (HLD)

```
                        ┌─────────────────────────────────────────┐
                        │        Backend — Node.js + Express       │
                        │                                          │
HTTP/HTTPS              │  ┌──────────────────────────────────┐   │     ┌─────────────────┐
Client ────────────────►│  │     Routes / Controllers         │   │────►│  Cloud Storage  │
(Web / App)             │  │  express-validator · cors        │   │     │   (Cloudinary)  │
                        │  └─────────────┬────────────────────┘   │     └─────────────────┘
                        │                │                         │
                        │  ┌─────────────▼────────────────────┐   │     ┌─────────────────┐
                        │  │          Middleware               │   │────►│    Database     │
                        │  │   Auth (JWT) · multer            │   │     │  (MongoDB Atlas) │
                        │  └─────────────┬────────────────────┘   │     └─────────────────┘
                        │                │                         │
                        │  ┌─────────────▼────────────────────┐   │     ┌─────────────────┐
                        │  │           Services               │   │────►│ Authentication  │
                        │  │  Business logic · Cloudinary     │   │     │  JWT · bcryptjs │
                        │  └─────────────┬────────────────────┘   │     └─────────────────┘
                        │                │                         │
                        │  ┌─────────────▼────────────────────┐   │
                        │  │       Mongoose Models             │   │
                        │  │   User · Media · Folder          │   │
                        │  └──────────────────────────────────┘   │
                        │                                          │
                        │         Environment Variables (.env)     │
                        └─────────────────────────────────────────┘
```

---

## Features (MVP v1)

- ✅ User Signup / Login
- ✅ Upload Images
- ✅ Upload Videos
- ✅ Cloud Storage Integration (Cloudinary)
- ✅ Personal Media Library
- ✅ View Uploaded Media
- ✅ Delete Media

---

## Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Runtime        | Node.js                           |
| Framework      | Express.js                        |
| Database       | MongoDB Atlas + Mongoose          |
| Cloud Storage  | Cloudinary                        |
| Authentication | JWT + bcryptjs                    |
| File Uploads   | Multer                            |
| Validation     | express-validator                 |
| Config         | dotenv                            |
| Dev Tool       | nodemon                           |

---

## Dependencies

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer cloudinary express-validator
npm install -D nodemon
```

| Package             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `express`           | Web framework and API routing                |
| `mongoose`          | MongoDB ODM for schemas and queries          |
| `cors`              | Cross-origin resource sharing                |
| `dotenv`            | Loads environment variables from `.env`      |
| `bcryptjs`          | Secure password hashing                      |
| `jsonwebtoken`      | JWT creation and verification                |
| `multer`            | Multipart/form-data file upload handling     |
| `cloudinary`        | Cloud storage for images, videos, and audio  |
| `express-validator` | Input validation and sanitization            |
| `nodemon` (dev)     | Auto-restarts server on file changes         |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/media-cloud-platform.git
cd media-cloud-platform/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
cp .env.example .env
```

Add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the development server

```bash
npm run dev
```

---

## Project Structure

```
backend/
├── controllers/      # Route handler logic
├── middleware/       # Auth, validation, upload middleware
├── models/           # Mongoose schemas (User, Media, Folder)
├── routes/           # Express route definitions
├── services/         # Business logic, Cloudinary integration
├── .env.example      # Environment variable template
└── server.js         # App entry point
```
