const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);
router.post('/logout', logoutUser);

module.exports = router;