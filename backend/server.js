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
app.use(express.json());

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
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

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
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