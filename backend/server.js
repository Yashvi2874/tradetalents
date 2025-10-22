const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const skillRoutes = require('./routes/skills');

const app = express();

// Create HTTP server
const server = createServer(app);

// Configure CORS properly
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://tradetalents.onrender.com',
      process.env.FRONTEND_URL // Add your frontend URL from environment variables
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  
  // Check if dist directory exists
  try {
    const fs = require('fs');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    } else {
      console.warn('Frontend dist directory not found, skipping static file serving');
    }
  } catch (err) {
    console.warn('Error checking frontend dist directory:', err.message);
  }
}

// Initialize Socket.IO with proper CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // List of allowed origins for Socket.IO
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5000',
        'https://tradetalents.onrender.com',
        process.env.FRONTEND_URL
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store active users and rooms
const activeUsers = new Map();
const sessionRooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins a session room
  socket.on('join-session', (data) => {
    const { sessionId, userId, userName } = data;
    
    // Store user info
    activeUsers.set(socket.id, { userId, userName, sessionId });
    
    // Join the session room
    socket.join(sessionId);
    
    // Notify others in the room
    socket.to(sessionId).emit('user-joined', {
      userId,
      userName,
      message: `${userName} joined the session`
    });
    
    console.log(`User ${userName} joined session ${sessionId}`);
  });

  // Handle incoming messages
  socket.on('send-message', (data) => {
    const { sessionId, userId, userName, content } = data;
    
    // Store message in memory (in a real app, you'd save to database)
    const message = {
      id: Date.now(),
      sessionId,
      userId,
      userName,
      content,
      timestamp: new Date()
    };
    
    // Broadcast message to all users in the session room
    io.to(sessionId).emit('receive-message', message);
    
    console.log(`Message from ${userName} in session ${sessionId}: ${content}`);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { sessionId, userId, userName, isTyping } = data;
    socket.to(sessionId).emit('user-typing', { userId, userName, isTyping });
  });

  // Handle session creation event
  socket.on('session-created', (data) => {
    const { session, userId } = data;
    
    // Emit event to update calendars in real-time
    io.emit('calendar-updated', {
      session,
      userId,
      message: 'New session created'
    });
    
    console.log(`Session created: ${session.title}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userInfo = activeUsers.get(socket.id);
    if (userInfo) {
      const { userId, userName, sessionId } = userInfo;
      
      // Remove user from active users
      activeUsers.delete(socket.id);
      
      // Notify others in the room
      if (sessionId) {
        socket.to(sessionId).emit('user-left', {
          userId,
          userName,
          message: `${userName} left the session`
        });
      }
      
      console.log(`User ${userName} disconnected`);
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/skills', skillRoutes);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'TradeTalents backend is healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Serve React frontend in production - THIS MUST BE AFTER API ROUTES AND BEFORE 404 HANDLER
if (process.env.NODE_ENV === 'production') {
  // Try multiple possible paths for the dist directory
  const possiblePaths = [
    path.join(__dirname, '../frontend/dist'),  // Standard structure
    path.join(__dirname, '../../frontend/dist'), // If deployed differently
    path.join(__dirname, 'frontend/dist'),     // Relative to backend
    path.join(__dirname, 'dist')               // Direct dist folder
  ];
  
  let distPath = null;
  
  // Find the first existing dist path
  for (const possiblePath of possiblePaths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(possiblePath)) {
        distPath = possiblePath;
        console.log(`Found frontend dist at: ${distPath}`);
        break;
      }
    } catch (err) {
      // Continue to next path
    }
  }
  
  if (distPath) {
    app.use(express.static(distPath));
    
    // Handle React routing, return all non-API requests to React app
    app.get(/^(?!\/api\/).*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.warn('Frontend dist directory not found in any expected location');
    console.warn('Checked paths:', possiblePaths);
  }
}

// 404 handler - THIS MUST BE LAST
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server is ready`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Export io for use in other modules
module.exports = { io, activeUsers, sessionRooms };