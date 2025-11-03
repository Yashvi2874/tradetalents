const express = require('express');
const router = express.Router();
const { 
  getMessagesBySession,
  createMessage,
  getUserMessages,
  getMessagesWithTutor
} = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.route('/')
  .get(auth, getUserMessages)
  .post(auth, createMessage);

router.route('/session/:sessionId')
  .get(auth, getMessagesBySession);

router.route('/tutor/:tutorId')
  .get(auth, getMessagesWithTutor);

module.exports = router;