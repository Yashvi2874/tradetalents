const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages for a session
// @route   GET /api/messages/session/:sessionId
// @access  Private
const getMessagesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Check if user has access to this session
    // In a real app, you would verify the user is part of the session
    // For now, we'll just get all messages for the session
    
    const messages = await Message.find({ session: sessionId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
const createMessage = async (req, res) => {
  try {
    const { session, content } = req.body;
    
    const message = new Message({
      session,
      sender: req.user._id,
      content,
      isTutor: req.user.role === 'tutor' // Set isTutor based on user role
    });
    
    const createdMessage = await message.save();
    
    // Add message to user's messages array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { messages: createdMessage._id }
    });
    
    // Populate sender info
    await createdMessage.populate('sender', 'name');
    
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Private
const getUserMessages = async (req, res) => {
  try {
    // Get messages where user is sender or part of the session
    // This would require joining with sessions collection to check if user is in session.students
    // For simplicity, we'll just get messages where user is sender
    const messages = await Message.find({ sender: req.user._id })
      .populate('session', 'title')
      .populate('sender', 'name')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessagesBySession,
  createMessage,
  getUserMessages
};