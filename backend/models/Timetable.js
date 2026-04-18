const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false
    },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'parent'],
      required: false
    },
    class: {
      type: String,
      trim: true,
      required: false
    },
    section: {
      type: String,
      trim: true,
      required: false
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: false
    },
    period: {
      type: Number,
      required: false
    },
    subject: {
      type: String,
      trim: true,
      required: false
    },
    teacher: {
      type: String,
      trim: true,
      required: false
    },
    startTime: {
      type: String,
      required: false
    },
    endTime: {
      type: String,
      required: false
    },
    room: {
      type: String,
      trim: true,
      required: false
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);
