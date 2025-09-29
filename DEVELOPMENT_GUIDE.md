# TradeTalents Development Guide

This guide provides instructions for setting up and developing the TradeTalents application.

## Project Overview

TradeTalents is a skill exchange platform that allows university students to share their skills and learn from each other. The application is built using the MERN stack:

- **MongoDB**: Database
- **Express.js**: Backend framework
- **React**: Frontend library
- **Node.js**: JavaScript runtime

## Project Structure

```
TradeTalents/
├── backend/           # Node.js/Express backend
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── .env           # Environment variables
│   ├── server.js      # Entry point
│   └── package.json   # Backend dependencies
├── frontend/          # React frontend
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── .env           # Environment variables
│   └── package.json   # Frontend dependencies
├── .gitignore         # Git ignore file
├── README.md          # Project documentation
└── LICENSE            # License information
```

## Initial Setup

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v14 or higher)
2. Install [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
3. Install [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone <repository-url>
cd TradeTalents
```

### Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

## Environment Configuration

### Backend Environment Variables

Create a [.env](file:///c:/Users/yasha/OneDrive/Desktop/TradeTalents/backend/.env) file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tradetalents
JWT_SECRET=your_jwt_secret_key_here
```

For production with MongoDB Atlas:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tradetalents?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret_key_here
```

### Frontend Environment Variables

Create a [.env](file:///c:/Users/yasha/OneDrive/Desktop/TradeTalents/frontend/.env) file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Running the Application

### Backend Development Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`.

### Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`.

### Running Both Servers

To run both servers simultaneously, you can use separate terminal windows or a tool like `concurrently`:

```bash
# Install concurrently globally
npm install -g concurrently

# Run both servers from the root directory
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## Database Setup

### Local MongoDB (Development)

1. Install [MongoDB Community Server](https://docs.mongodb.com/manual/installation/)
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. The backend will automatically connect to `mongodb://localhost:27017/tradetalents`

### MongoDB Atlas (Production)

Follow the [MongoDB Atlas Setup Guide](MONGODB_ATLAS_SETUP.md) for production deployment.

## API Testing

### Using the Test Script

```bash
cd backend
npm test
```

### Using Postman or curl

Example API calls:

1. Register a new user:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","university":"Test University"}'
   ```

2. Login:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. Get user profile (replace `YOUR_TOKEN` with actual JWT token):
   ```bash
   curl -X GET http://localhost:5000/api/users/profile \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Code Structure Guidelines

### Backend

1. **Models**: Define data schemas using Mongoose
2. **Controllers**: Handle business logic
3. **Routes**: Define API endpoints
4. **Middleware**: Handle authentication, validation, etc.
5. **Config**: Configuration files

### Frontend

1. **Components**: Reusable UI components
2. **Pages**: Page-level components that correspond to routes
3. **Contexts**: React context providers for global state
4. **Services**: API service functions
5. **Utils**: Utility functions
6. **Assets**: Static assets (images, etc.)

## Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes locally

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

5. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a pull request

## Code Quality

### Backend

1. Use consistent error handling
2. Validate all input data
3. Use middleware for authentication
4. Follow REST API best practices

### Frontend

1. Use functional components with hooks
2. Implement proper error handling
3. Use context for global state management
4. Follow CSS module conventions

## Deployment

### Frontend

1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

### Backend

1. Set environment variables for production
2. Deploy to your preferred Node.js hosting platform
3. Ensure MongoDB connection is configured for production

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in [.env](file:///c:/Users/yasha/OneDrive/Desktop/TradeTalents/backend/.env)
2. **MongoDB connection failed**: Check your MongoDB URI and network access
3. **CORS errors**: Ensure CORS is properly configured in the backend
4. **JWT token invalid**: Check your JWT_SECRET configuration

### Getting Help

1. Check the console logs for error messages
2. Review the documentation in each README file
3. Open an issue on the repository if you encounter bugs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

Follow the development workflow described above.