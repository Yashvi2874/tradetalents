const Session = require('../models/Session');
const User = require('../models/User');
const Skill = require('../models/Skill');

// Helper function to find or create skills by name
const findOrCreateSkills = async (skillNames, tutorId) => {
  const skillIds = [];
  
  for (const name of skillNames) {
    // Try to find existing skill by name (case insensitive)
    let skill = await Skill.findOne({ name: new RegExp(`^${name}$`, 'i') });
    
    // If skill doesn't exist, create it
    if (!skill) {
      skill = new Skill({
        name,
        category: 'General', // Default category
        description: `Skill for ${name}`,
        level: 'Beginner',
        tutor: tutorId,
        price: 10 // Default price
      });
      await skill.save();
    }
    
    skillIds.push(skill._id);
  }
  
  return skillIds;
};

// @desc    Get all sessions with skill information
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    // Get sessions where user is either tutor or student directly from MongoDB
    const sessions = await Session.find({
      $or: [
        { tutor: req.user._id },
        { students: req.user._id }
      ]
    })
    .populate('tutor', 'name')
    .populate('students', 'name')
    .populate('skills', 'name category') // Populate skill information
    .lean(); // Use lean() for better performance

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions from MongoDB:', error);
    res.status(500).json({ message: 'Failed to fetch sessions from database', error: error.message });
  }
};

// @desc    Get session by ID with skill information
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    // Fetch session directly from MongoDB
    const session = await Session.findById(req.params.id)
      .populate('tutor', 'name email')
      .populate('students', 'name')
      .populate('skills', 'name category description') // Populate skill information
      .lean();

    if (session) {
      // Check if user has access to this session
      const isTutor = session.tutor._id.toString() === req.user._id.toString();
      const isStudent = session.students.some(
        student => student._id.toString() === req.user._id.toString()
      );

      if (isTutor || isStudent) {
        res.json(session);
      } else {
        res.status(403).json({ message: 'Not authorized to access this session' });
      }
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    console.error('Error fetching session from MongoDB:', error);
    res.status(500).json({ message: 'Failed to fetch session from database', error: error.message });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private (Tutors and Students)
const createSession = async (req, res) => {
  try {
    const { title, description, startTime, endTime, price, maxStudents, meetLink, skillNames } = req.body;

    // Allow both tutors and students to create sessions in both development and production
    // Removed the role restriction that was previously limiting session creation to tutors only in production
    if (req.user.role !== 'tutor' && req.user.role !== 'student' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only tutors and students can create sessions' });
    }

    // Validate that startTime is before endTime
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Use provided meetLink or generate a new one
    const sessionMeetLink = meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}`;

    // Handle comma-separated skill names
    let skillIds = [];
    if (skillNames) {
      // Split skill names by comma and trim whitespace
      const names = skillNames.split(',').map(name => name.trim()).filter(name => name);
      
      // Find or create skills by name
      skillIds = await findOrCreateSkills(names, req.user._id);
    }

    const session = new Session({
      title,
      description,
      tutor: req.user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price: price || 10, // Default price if not provided
      maxStudents: maxStudents || 10, // Default max students if not provided
      meetLink: sessionMeetLink,
      skills: skillIds // Add skills array if provided
    });

    const createdSession = await session.save();
    
    // Populate tutor info
    await createdSession.populate('tutor', 'name');
    
    res.status(201).json(createdSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Tutors only)
const updateSession = async (req, res) => {
  try {
    const { title, description, startTime, endTime, price, maxStudents, status, meetLink } = req.body;

    const session = await Session.findById(req.params.id);

    if (session) {
      // Only tutor who created session can update it
      if (session.tutor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this session' });
      }

      session.title = title || session.title;
      session.description = description || session.description;
      session.startTime = startTime ? new Date(startTime) : session.startTime;
      session.endTime = endTime ? new Date(endTime) : session.endTime;
      session.price = price || session.price;
      session.maxStudents = maxStudents || session.maxStudents;
      session.status = status || session.status;
      // Only allow tutor to update meetLink if provided
      if (meetLink !== undefined) {
        session.meetLink = meetLink;
      }

      const updatedSession = await session.save();
      
      // Populate tutor info
      await updatedSession.populate('tutor', 'name');
      await updatedSession.populate('students', 'name');
      
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Tutors only)
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (session) {
      // Only tutor who created session can delete it
      if (session.tutor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this session' });
      }

      await session.deleteOne();
      res.json({ message: 'Session removed' });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join session
// @route   POST /api/sessions/:id/join
// @access  Private (Students only)
const joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (session) {
      // Only students can join sessions
      if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can join sessions' });
      }

      // Check if user is already enrolled
      if (session.students.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already enrolled in this session' });
      }

      // Check if session is full
      if (session.students.length >= session.maxStudents) {
        return res.status(400).json({ message: 'Session is full' });
      }

      // Check if user has enough credits
      if (req.user.credits < session.price) {
        return res.status(400).json({ message: 'Not enough credits' });
      }

      // Deduct credits from user
      const user = await User.findById(req.user._id);
      user.credits -= session.price;
      await user.save();

      // Add user to session
      session.students.push(req.user._id);
      const updatedSession = await session.save();

      // Populate data
      await updatedSession.populate('tutor', 'name');
      await updatedSession.populate('students', 'name');

      res.json({
        message: 'Successfully joined session',
        session: updatedSession,
        remainingCredits: user.credits
      });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sessions by skill ID
// @route   GET /api/sessions/skill/:skillId
// @access  Public
const getSessionsBySkill = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const skillId = req.params.skillId;
    
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

module.exports = {
  getSessions,
  getSessionById,
  getSessionsBySkill,
  createSession,
  updateSession,
  deleteSession,
  joinSession,
};