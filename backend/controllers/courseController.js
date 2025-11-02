const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, search, sortBy, level } = req.query;
    
    // Build filter
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (level && level !== 'all') {
      filter.level = level;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Build sort
    let sort = {};
    
    switch (sortBy) {
      case 'popular':
        sort.enrollmentCount = -1;
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
      case 'newest':
        sort.createdAt = -1;
        break;
      default:
        sort.enrollmentCount = -1; // Most popular by default
    }
    
    const courses = await Course.find(filter)
      .populate('instructor', 'name')
      .sort(sort);
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name university');
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Tutors only)
const createCourse = async (req, res) => {
  try {
    const { 
      title,
      description,
      category,
      level,
      price,
      duration,
      lessons,
      prerequisites,
      learningOutcomes,
      tags,
      thumbnail
    } = req.body;
    
    // Only tutors can create courses
    if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only tutors can create courses' });
    }
    
    const course = new Course({
      title,
      description,
      category,
      level,
      price,
      duration,
      lessons,
      prerequisites,
      learningOutcomes,
      tags,
      thumbnail,
      instructor: req.user._id,
    });
    
    const createdCourse = await course.save();
    
    // Populate instructor info
    await createdCourse.populate('instructor', 'name');
    
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Tutors only)
const updateCourse = async (req, res) => {
  try {
    const { 
      title,
      description,
      category,
      level,
      price,
      duration,
      lessons,
      prerequisites,
      learningOutcomes,
      tags,
      thumbnail,
      status,
      isFeatured
    } = req.body;
    
    const course = await Course.findById(req.params.id);
    
    if (course) {
      // Only instructor who created course can update it
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this course' });
      }
      
      course.title = title || course.title;
      course.description = description || course.description;
      course.category = category || course.category;
      course.level = level || course.level;
      course.price = price || course.price;
      course.duration = duration || course.duration;
      course.lessons = lessons || course.lessons;
      course.prerequisites = prerequisites || course.prerequisites;
      course.learningOutcomes = learningOutcomes || course.learningOutcomes;
      course.tags = tags || course.tags;
      course.thumbnail = thumbnail || course.thumbnail;
      course.status = status || course.status;
      
      if (req.user.role === 'admin') {
        course.isFeatured = isFeatured !== undefined ? isFeatured : course.isFeatured;
      }
      
      const updatedCourse = await course.save();
      
      // Populate instructor info
      await updatedCourse.populate('instructor', 'name');
      
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Tutors only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (course) {
      // Only instructor who created course can delete it
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this course' });
      }
      
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Students only)
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (course) {
      // Check if student is already enrolled
      if (course.students.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }
      
      // Add student to course
      course.students.push(req.user._id);
      course.enrollmentCount = course.students.length;
      
      // Deduct credits from student (if applicable)
      const student = await User.findById(req.user._id);
      if (student.credits < course.price) {
        return res.status(400).json({ message: 'Insufficient credits' });
      }
      
      student.credits -= course.price;
      await student.save();
      
      await course.save();
      
      res.json({ message: 'Successfully enrolled in course' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse
};