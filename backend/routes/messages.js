const express = require('express');
const router = express.Router();
const { 
  getMessagesBySession,
  createMessage,
  getUserMessages
} = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.route('/')
  .get(auth, getUserMessages)
  .post(auth, createMessage);

router.route('/session/:sessionId')
  .get(auth, getMessagesBySession);

module.exports = router;