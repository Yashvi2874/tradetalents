const Message = require('../models/Message');
const User = require('../models/User');
const Session = require('../models/Session');

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
    const { session, recipient, content } = req.body;
    
    // Validate required fields
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Create the message
    const message = new Message({
      session: session || null, // Allow null for tutor chats
      sender: req.user._id,
      recipient: recipient || null, // Allow null for session chats
      content,
      isTutor: req.user.role === 'tutor' // Set isTutor based on user role
    });
    
    const createdMessage = await message.save();
    
    // Add message to sender's messages array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { messages: createdMessage._id }
    });
    
    // If there's a recipient, add message to their messages array
    if (recipient) {
      await User.findByIdAndUpdate(recipient, {
        $push: { messages: createdMessage._id }
      });
    }
    
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
    // Get messages where user is sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('session', 'title')
    .populate('sender', 'name')
    .populate('recipient', 'name')
    .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages between user and tutor (for tutor chat functionality)
// @route   GET /api/messages/tutor/:tutorId
// @access  Private
const getMessagesWithTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const userId = req.user._id;
    
    // Get messages between the current user and the tutor
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: tutorId },
        { sender: tutorId, recipient: userId }
      ]
    })
    .populate('sender', 'name')
    .populate('recipient', 'name')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
const getConversationWithUser = async (req, res) => {
  try {
    const { userId } = req.params; // The other user's ID
    const currentUserId = req.user._id;
    
    // Get messages between the current user and the specified user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
    .populate('sender', 'name')
    .populate('recipient', 'name')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessagesBySession,
  createMessage,
  getUserMessages,
  getMessagesWithTutor,
  getConversationWithUser
};