# TradeTalents

TradeTalents is a skill exchange platform that connects learners and teachers. Users can share their skills, learn new ones, and build a community around knowledge sharing.

## Features

- **User Authentication**: Secure login and registration system
- **Skill Browsing**: Discover and search for skills to learn or teach
- **Real-time Messaging**: Chat with other users using Socket.IO
- **Session Booking**: Schedule and manage learning sessions
- **Credit System**: Earn and spend credits for sessions
- **AI Chatbot**: Gemini-powered assistant for learning support
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Google Gemini API key (for chatbot feature)

## Environment Variables

### Frontend (.env)
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)
Create a `.env` file in the backend directory:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your backend `.env` file

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/trade-talents.git
cd trade-talents
```

2. Install dependencies:
```bash
npm run install-all
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

3. Serve the frontend build (using a static server or through the backend)

## Deployment

The application is configured for deployment on Render. The `render.yaml` file contains the deployment configuration.

### Environment Variables for Production

Make sure to set the following environment variables in your Render dashboard:

**Frontend:**
- VITE_API_URL=https://your-backend-url.onrender.com/api
- VITE_BACKEND_URL=https://your-backend-url.onrender.com

**Backend:**
- NODE_ENV=production
- PORT=5000
- MONGODB_URI=your_production_mongodb_connection_string
- JWT_SECRET=your_production_jwt_secret
- FRONTEND_URL=https://your-frontend-url.onrender.com
- GEMINI_API_KEY=your_production_gemini_api_key

## Project Structure

```
TradeTalents/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── ...
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
└── ...
```

## Key Features Implementation

### Real-time Messaging
- Implemented using Socket.IO
- Supports private messaging between users
- Typing indicators and online status
- Persistent message storage in MongoDB

### Session Booking
- Users can book sessions for skills
- Calendar integration for scheduling
- Real-time updates when sessions are booked

### Skill Exchange
- Users can browse and search skills
- Credit-based system for transactions
- Skill details and tutor information

### AI Chatbot
- Powered by Google Gemini API
- Available as a toggle in chat sessions
- Dedicated chatbot page for general assistance
- Context-aware responses based on skills

## Troubleshooting

### MongoDB Connection Issues
1. Ensure your IP address is whitelisted in MongoDB Atlas
2. Check your connection string format
3. Verify your MongoDB credentials

### CORS Issues
1. Check the FRONTEND_URL environment variable
2. Ensure the allowed origins are correctly configured in the backend

### Authentication Issues
1. Verify JWT_SECRET is set correctly
2. Check token expiration settings
3. Ensure proper token handling in frontend

### Chatbot Issues
1. Verify GEMINI_API_KEY is set correctly
2. Check that the @google/generative-ai package is installed
3. Ensure you have a stable internet connection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

For support or questions, please open an issue in the repository.