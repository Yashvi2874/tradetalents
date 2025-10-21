const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Get all sessions for current user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    // Get sessions where user is either tutor or student
    const sessions = await Session.find({
      $or: [
        { tutor: req.user._id },
        { students: req.user._id }
      ]
    })
    .populate('tutor', 'name')
    .populate('students', 'name');

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('tutor', 'name email')
      .populate('students', 'name');

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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private (Tutors only)
const createSession = async (req, res) => {
  try {
    const { title, description, startTime, endTime, price, maxStudents } = req.body;

    // Only tutors can create sessions
    if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only tutors can create sessions' });
    }

    const session = new Session({
      title,
      description,
      tutor: req.user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price,
      maxStudents,
    });

    const createdSession = await session.save();
    
    // Populate tutor info
    await createdSession.populate('tutor', 'name');
    
    res.status(201).json(createdSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Tutors only)
const updateSession = async (req, res) => {
  try {
    const { title, description, startTime, endTime, price, maxStudents, status } = req.body;

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

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  joinSession,
};