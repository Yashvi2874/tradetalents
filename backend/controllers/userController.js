const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, university, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.university = university || user.university;
      user.bio = bio || user.bio;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        credits: updatedUser.credits,
        bio: updatedUser.bio,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user skills
// @route   GET /api/users/skills
// @access  Private
const getUserSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('skills');
    res.json(user.skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add skill to user
// @route   POST /api/users/skills
// @access  Private
const addUserSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user) {
      // Check if skill is already added
      if (user.skills.includes(skillId)) {
        return res.status(400).json({ message: 'Skill already added' });
      }
      
      user.skills.push(skillId);
      await user.save();
      
      res.json({ message: 'Skill added successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserSkills,
  addUserSkill,
};