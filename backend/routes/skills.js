const express = require('express');
const router = express.Router();
const { 
  getSkills,
  getSkillById,
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

module.exports = router;