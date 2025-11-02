const axios = require('axios');

// @desc    Get chatbot response
// @route   POST /api/chatbot/message
// @access  Private
const getChatbotResponse = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Validate required fields
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Chatbot service not configured' });
    }
    
    // Create prompt with context
    let prompt = `You are Talon, an AI assistant for a skill exchange platform called TradeTalents. 
    Users can learn and teach various skills on this platform. 
    Please provide helpful and friendly responses to user queries.
    
    User message: ${message}`;
    
    // Add context if provided
    if (context) {
      prompt += `\n\nContext: ${context}`;
    }
    
    // Prepare the request data
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };
    
    // Make API request to Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );
    
    // Extract the response text
    const text = response.data.candidates[0].content.parts[0].text;
    
    // Return the response
    res.json({
      response: text,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chatbot error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to get chatbot response',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get chatbot response for skill-related queries
// @route   POST /api/chatbot/skill-assistant
// @access  Private
const getSkillAssistantResponse = async (req, res) => {
  try {
    const { message, skill, userLevel } = req.body;
    
    // Validate required fields
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Chatbot service not configured' });
    }
    
    // Create prompt for skill assistant
    let prompt = `You are Talon, a skill teaching assistant on TradeTalents platform. 
    You help users with learning and teaching various skills.
    
    User message: ${message}`;
    
    if (skill) {
      prompt += `\n\nSkill topic: ${skill}`;
    }
    
    if (userLevel) {
      prompt += `\n\nUser level: ${userLevel}`;
    }
    
    // Prepare the request data
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };
    
    // Make API request to Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );
    
    // Extract the response text
    const text = response.data.candidates[0].content.parts[0].text;
    
    // Return the response
    res.json({
      response: text,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Skill assistant error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to get skill assistant response',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getChatbotResponse,
  getSkillAssistantResponse
};