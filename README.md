# TradeTalents 🚀

A skill exchange platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform allows users to share their skills, learn from others, and participate in skill-based sessions.

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=javascript" alt="MERN Stack">
</p>

## 🌟 Features

### 🔐 User Management
- Secure user registration and authentication
- Comprehensive profile management
- Credit system for transactions

### 💡 Skill Exchange
- Browse and search skills by category
- Create and manage skill sessions
- Join sessions with other users
- Rate and review skills

### 💬 Communication
- Real-time messaging between session participants
- Session-specific chat rooms

---

## 📸 UI Preview

*Dashboard View - Overview of user activities and available sessions*
![Dashboard Preview](./images/dashboard.png)

*Browse Skills - Discover and search for skills offered by other users*
![Browse Skills Preview](./images/browse-skills.png)

*Session Chat - Real-time communication between session participants*
![Chat Preview](./images/chat.png)

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, React Router v6, Axios, CSS Modules |
| **Backend** | Node.js, Express.js, MongoDB with Mongoose |
| **Authentication** | JWT, Bcrypt |
| **Security** | Helmet, CORS |
| **Development** | Nodemon, Concurrently, Vite |

## 📁 Project Structure

```
TradeTalents/
├── backend/           # Node.js/Express backend API
│   ├── config/        # Database configuration
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── server.js      # Entry point
└── frontend/          # React frontend application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Page components
    │   ├── services/   # API service layer
    │   └── contexts/   # React contexts
    └── vite.config.js # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TradeTalents
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

---

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

You can use the provided example:
```bash
cd backend
cp .env.example .env
```

### Frontend Environment Variables

The frontend uses Vite, which requires environment variables to be prefixed with `VITE_`. Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

You can use the provided example:
```bash
cd frontend
cp .env.example .env
```

---

## ▶️ Running the Application

### Development Mode (Recommended)

To run both frontend and backend concurrently:

From the root directory:
```bash
npm run dev
```

This will start both servers simultaneously:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Running Applications Separately

#### Backend Server
```bash
cd backend
npm run dev
```
- Runs on `http://localhost:5000`
- API endpoints available at `http://localhost:5000/api/`

#### Frontend Server
```bash
cd frontend
npm run dev
```
- Runs on `http://localhost:5173` (default Vite port)
- Automatically proxies API requests to backend

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```
The built files will be in the `dist/` directory, ready for deployment to any static hosting service (Netlify, Vercel, etc.).

## 🚀 Deployment Instructions

### Deploying to Render.com

1. **Create two services on Render:**

   **Web Service for Backend:**
   - Name: `tradetalents-backend`
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `backend`
   - Add environment variables:
     - `MONGODB_URI` = your MongoDB connection string
     - `JWT_SECRET` = your JWT secret
     - `PORT` = 5000

   **Static Site for Frontend:**
   - Name: `tradetalents-frontend`
   - Runtime: Static Site
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Root directory: `frontend`
   - Add environment variables:
     - `VITE_API_URL` = https://your-backend-service.onrender.com/api

2. **Alternative Single Repository Deployment:**
   - Build command: `npm install && npm run install-all && npm run build`
   - Start command: `npm start`

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 📦 Deployment

### Frontend
Build the production-ready frontend:
```bash
cd frontend
npm run build
```
The built files will be in the `dist/` directory, ready for deployment to any static hosting service (Netlify, Vercel, etc.).

### Backend
Deploy to any Node.js hosting service (Heroku, DigitalOcean, AWS, etc.) with the proper environment variables set.

---

## 🤝 Contributing

We welcome contributions to TradeTalents! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">Made with ❤️ by the TradeTalents Team</p>