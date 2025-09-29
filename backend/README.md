# TradeTalents Backend

This is the backend API for TradeTalents, a skill exchange platform built with the MERN stack.

## Features

- User authentication (register, login, logout)
- User profiles with skill management
- Session creation and management
- Skill browsing and searching
- Real-time messaging (via WebSocket in future)
- Credit system for transactions

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Update the `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### MongoDB Atlas Setup

For production deployment, we recommend using MongoDB Atlas:

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (free tier available)
3. Configure database access:
   - Create a database user with read/write permissions
4. Configure network access:
   - Add your IP address or allow access from anywhere (for development)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace placeholders
6. Update your `MONGODB_URI` in the `.env` file with your Atlas connection string

### Running the Application

- For development:
  ```bash
  npm run dev
  ```

- For production:
  ```bash
  npm start
  ```

### Testing

Run the API test script to verify endpoints:
```bash
npm test
```

This will test basic functionality including registration, login, and profile retrieval.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/skills` - Get user skills
- `POST /api/users/skills` - Add skill to user

### Sessions
- `GET /api/sessions` - Get all sessions for current user
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/sessions/:id/join` - Join session

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── .env             # Environment variables
├── .gitignore       # Git ignore file
├── server.js        # Entry point
└── package.json     # Project dependencies
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

## License

This project is licensed under the MIT License.