const User = require('../models/User');
const Skill = require('../models/Skill');

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
    const { name, university, bio, linkedin, github, degree, yearOfStudy, userSkills } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.university = university || user.university;
      user.bio = bio || user.bio;
      user.linkedin = linkedin || user.linkedin;
      user.github = github || user.github;
      user.degree = degree || user.degree;
      user.yearOfStudy = yearOfStudy || user.yearOfStudy;
      user.userSkills = userSkills || user.userSkills;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        credits: updatedUser.credits,
        bio: updatedUser.bio,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
        degree: updatedUser.degree,
        yearOfStudy: updatedUser.yearOfStudy,
        userSkills: updatedUser.userSkills,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user skills (where user is the tutor)
// @route   GET /api/users/skills
// @access  Private
const getUserSkills = async (req, res) => {
  try {
    // Get skills where the user is the tutor
    const skills = await Skill.find({ tutor: req.user._id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add skill to user
// @route   POST /api/users/skills
// @access  Private
const addUserSkill = async (req, res) => {
  try {
    // This endpoint is not needed since skills are created directly
    // Keeping it for backward compatibility
    res.status(400).json({ message: 'Use POST /api/skills to create skills' });
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