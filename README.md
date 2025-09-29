# TradeTalents

TradeTalents is a skill exchange platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform allows users to share their skills, learn from others, and participate in skill-based sessions.

## Project Structure

```
TradeTalents/
├── backend/     # Node.js/Express backend API
└── frontend/    # React frontend application
```

## Features

### User Management
- User registration and authentication
- Profile management
- Credit system for transactions

### Skill Exchange
- Browse and search skills by category
- Create and manage skill sessions
- Join sessions with other users
- Rate and review skills

### Communication
- Real-time messaging between session participants
- Session-specific chat rooms

## Technology Stack

### Frontend
- React 18
- React Router v6
- Axios for API requests
- CSS Modules for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Database
- MongoDB (local development)
- MongoDB Atlas (production)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TradeTalents
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables (see individual README files for details)

### Running the Application

#### Frontend
```bash
cd frontend
npm run dev
```

#### Backend
```bash
cd backend
npm run dev
```

## Development

### Folder Structure
- `frontend/` - React application
- `backend/` - Node.js/Express API

### Environment Variables
Each part of the application requires specific environment variables. See the individual README files for details.

## Deployment

### Frontend
The frontend can be deployed to any static hosting service (Netlify, Vercel, etc.).

### Backend
The backend can be deployed to any Node.js hosting service (Heroku, DigitalOcean, AWS, etc.).

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For questions or support, please open an issue on the repository.