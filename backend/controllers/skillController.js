const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    
    // Build filter
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Build sort
    let sort = {};
    
    switch (sortBy) {
      case 'popular':
        sort.students = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      default:
        sort.students = -1; // Most popular by default
    }
    
    const skills = await Skill.find(filter)
      .populate('tutor', 'name')
      .sort(sort);
    
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('tutor', 'name university');
    
    if (skill) {
      res.json(skill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Tutors only)
const createSkill = async (req, res) => {
  try {
    const { name, category, description, level, tags, price } = req.body;
    
    // Only tutors can create skills
    if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only tutors can create skills' });
    }
    
    const skill = new Skill({
      name,
      category,
      description,
      level,
      tags,
      tutor: req.user._id,
      price,
    });
    
    const createdSkill = await skill.save();
    
    // Populate tutor info
    await createdSkill.populate('tutor', 'name');
    
    res.status(201).json(createdSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Tutors only)
const updateSkill = async (req, res) => {
  try {
    const { name, category, description, level, tags, price } = req.body;
    
    const skill = await Skill.findById(req.params.id);
    
    if (skill) {
      // Only tutor who created skill can update it
      if (skill.tutor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this skill' });
      }
      
      skill.name = name || skill.name;
      skill.category = category || skill.category;
      skill.description = description || skill.description;
      skill.level = level || skill.level;
      skill.tags = tags || skill.tags;
      skill.price = price || skill.price;
      
      const updatedSkill = await skill.save();
      
      // Populate tutor info
      await updatedSkill.populate('tutor', 'name');
      
      res.json(updatedSkill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Tutors only)
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (skill) {
      // Only tutor who created skill can delete it
      if (skill.tutor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this skill' });
      }
      
      await skill.deleteOne();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};