const express = require('express');
const router = express.Router();
const { 
  getSessions,
  getSessionById,
  getSessionsBySkill,
  createSession,
  updateSession,
  deleteSession,
  joinSession
} = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.route('/')
  .get(auth, getSessions)
  .post(auth, createSession);

router.route('/skill/:skillId')
  .get(getSessionsBySkill);

router.route('/:id')
  .get(auth, getSessionById)
  .put(auth, updateSession)
  .delete(auth, deleteSession);

router.route('/:id/join')
  .post(auth, joinSession);

module.exports = router;