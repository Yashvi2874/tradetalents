const Skill = require('../models/Skill');
const User = require('../models/User');
const Session = require('../models/Session');

// @desc    Get all skills with session information
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    
    // Build filter - ensure we're only fetching from MongoDB
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
    
    // Fetch skills directly from MongoDB with proper population
    const skills = await Skill.find(filter)
      .populate('tutor', 'name')
      .sort(sort)
      .lean(); // Use lean() for better performance
    
    // Add session information for each skill by querying the sessions collection directly
    const skillsWithSessionInfo = await Promise.all(skills.map(async (skill) => {
      // Count upcoming sessions for this skill directly from MongoDB
      const upcomingSessionCount = await Session.countDocuments({ 
        skills: skill._id, 
        status: 'upcoming',
        startTime: { $gte: new Date() }
      });
      
      // Count total sessions for this skill directly from MongoDB
      const totalSessionCount = await Session.countDocuments({ 
        skills: skill._id 
      });
      
      return {
        ...skill,
        upcomingSessions: upcomingSessionCount,
        totalSessions: totalSessionCount
      };
    }));
    
    res.json(skillsWithSessionInfo);
  } catch (error) {
    console.error('Error fetching skills from MongoDB:', error);
    res.status(500).json({ message: 'Failed to fetch skills from database', error: error.message });
  }
};

// @desc    Get skill by ID with detailed session information
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res) => {
  try {
    // Fetch skill directly from MongoDB
    const skill = await Skill.findById(req.params.id)
      .populate('tutor', 'name university')
      .lean();
    
    if (skill) {
      // Get upcoming sessions for this skill directly from MongoDB sessions collection
      const upcomingSessions = await Session.find({ 
        skills: skill._id, 
        status: 'upcoming',
        startTime: { $gte: new Date() }
      })
      .populate('tutor', 'name')
      .populate('students', 'name')
      .sort({ startTime: 1 })
      .limit(10) // Increase limit to 10 upcoming sessions
      .lean();
      
      // Get recent past sessions for this skill directly from MongoDB
      const pastSessions = await Session.find({ 
        skills: skill._id, 
        status: { $in: ['completed', 'cancelled'] },
        startTime: { $lt: new Date() }
      })
      .populate('tutor', 'name')
      .populate('students', 'name')
      .sort({ startTime: -1 })
      .limit(5)
      .lean();
      
      // Get session statistics directly from MongoDB
      const sessionStats = {
        total: await Session.countDocuments({ skills: skill._id }),
        upcoming: await Session.countDocuments({ 
          skills: skill._id, 
          status: 'upcoming',
          startTime: { $gte: new Date() }
        }),
        completed: await Session.countDocuments({ 
          skills: skill._id, 
          status: 'completed'
        }),
        studentsEnrolled: await Session.distinct('students', { skills: skill._id }).then(students => students.length)
      };
      
      res.json({
        ...skill,
        upcomingSessions,
        pastSessions,
        sessionStats
      });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error('Error fetching skill from MongoDB:', error);
    res.status(500).json({ message: 'Failed to fetch skill from database', error: error.message });
  }
};

// @desc    Get sessions for a specific skill
// @route   GET /api/skills/:id/sessions
// @access  Public
const getSkillSessions = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const skillId = req.params.id;
    
    // Validate skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Build filter
    const filter = { skills: skillId };
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Add date filters based on status
    const now = new Date();
    if (status === 'upcoming') {
      filter.startTime = { $gte: now };
    } else if (status === 'past') {
      filter.startTime = { $lt: now };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch sessions with pagination
    const sessions = await Session.find(filter)
      .populate('tutor', 'name')
      .populate('students', 'name')
      .sort({ startTime: status === 'upcoming' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Session.countDocuments(filter);
    
    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSessions: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session statistics for a specific skill
// @route   GET /api/skills/:id/session-stats
// @access  Public
const getSkillSessionStats = async (req, res) => {
  try {
    const skillId = req.params.id;
    
    // Validate skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Get session statistics
    const stats = {
      total: await Session.countDocuments({ skills: skillId }),
      upcoming: await Session.countDocuments({ 
        skills: skillId, 
        status: 'upcoming',
        startTime: { $gte: new Date() }
      }),
      ongoing: await Session.countDocuments({ 
        skills: skillId, 
        status: 'ongoing'
      }),
      completed: await Session.countDocuments({ 
        skills: skillId, 
        status: 'completed'
      }),
      cancelled: await Session.countDocuments({ 
        skills: skillId, 
        status: 'cancelled'
      }),
      studentsEnrolled: await Session.distinct('students', { skills: skillId }).then(students => students.length),
      averageSessionPrice: await Session.aggregate([
        { $match: { skills: skillId } },
        { $group: { _id: null, average: { $avg: "$price" } } }
      ]).then(result => result.length > 0 ? Math.round(result[0].average) : 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new skill(s)
// @route   POST /api/skills
// @access  Private (Tutors only)
const createSkill = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      description, 
      level, 
      tags, 
      price,
      duration,
      prerequisites,
      learningOutcomes,
      thumbnail
    } = req.body;
    
    // Only tutors can create skills
    if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only tutors can create skills' });
    }
    
    // Split skill names by comma if multiple skills are provided
    const skillNames = name.split(',').map(skillName => skillName.trim()).filter(skillName => skillName);
    
    // Create an array to store all created skills
    const createdSkills = [];
    
    // Create each skill
    for (const skillName of skillNames) {
      const skill = new Skill({
        name: skillName,
        category,
        description,
        level,
        tags,
        tutor: req.user._id,
        price,
        duration,
        prerequisites,
        learningOutcomes,
        thumbnail
      });
      
      const createdSkill = await skill.save();
      await createdSkill.populate('tutor', 'name');
      createdSkills.push(createdSkill);
    }
    
    // Return all created skills
    if (createdSkills.length === 1) {
      res.status(201).json(createdSkills[0]);
    } else {
      res.status(201).json(createdSkills);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Tutors only)
const updateSkill = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      description, 
      level, 
      tags, 
      price,
      duration,
      prerequisites,
      learningOutcomes,
      thumbnail,
      isFeatured
    } = req.body;
    
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
      skill.duration = duration || skill.duration;
      skill.prerequisites = prerequisites || skill.prerequisites;
      skill.learningOutcomes = learningOutcomes || skill.learningOutcomes;
      skill.thumbnail = thumbnail || skill.thumbnail;
      if (req.user.role === 'admin') {
        skill.isFeatured = isFeatured !== undefined ? isFeatured : skill.isFeatured;
      }
      
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
  getSkillSessions,
  getSkillSessionStats,
  createSkill,
  updateSkill,
  deleteSkill,
};