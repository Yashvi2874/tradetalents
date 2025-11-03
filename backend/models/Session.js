const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  meetLink: {
    type: String,
    default: null
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);