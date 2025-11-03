const express = require('express');
const router = express.Router();
const { 
  getSkills,
  getSkillById,
  getSkillSessions,
  getSkillSessionStats,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const auth = require('../middleware/auth');

router.route('/')
  .get(getSkills)
  .post(auth, createSkill);

router.route('/:id')
  .get(getSkillById)
  .put(auth, updateSkill)
  .delete(auth, deleteSkill);

router.route('/:id/sessions')
  .get(getSkillSessions);

router.route('/:id/session-stats')
  .get(getSkillSessionStats);

module.exports = router;