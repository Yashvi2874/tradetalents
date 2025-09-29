const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  getUserSkills, 
  addUserSkill 
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.route('/profile')
  .get(auth, getProfile)
  .put(auth, updateProfile);

router.route('/skills')
  .get(auth, getUserSkills)
  .post(auth, addUserSkill);

module.exports = router;