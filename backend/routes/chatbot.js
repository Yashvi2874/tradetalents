const express = require('express');
const router = express.Router();
const { 
  getChatbotResponse,
  getSkillAssistantResponse
} = require('../controllers/chatbotController');
const auth = require('../middleware/auth');

// @route   POST /api/chatbot/message
// @desc    Get chatbot response
// @access  Private
router.post('/message', auth, getChatbotResponse);

// @route   POST /api/chatbot/skill-assistant
// @desc    Get skill assistant response
// @access  Private
router.post('/skill-assistant', auth, getSkillAssistantResponse);

module.exports = router;