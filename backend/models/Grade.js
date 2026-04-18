const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true
    },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'parent'],
      required: [true, 'Please provide a user type'],
      default: 'student'
    },
    class: {
      type: String,
      required: [true, 'Please provide a class'],
      trim: true
    },
    section: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: [false, 'Please provide a subject'],
      trim: true
    },
    marksObtained: {
      type: Number,
      required: [false, 'Please provide marks obtained'],
      min: 0,
      max: 100
    },
    totalMarks: {
      type: Number,
      required: [false, 'Please provide total marks'],
      default: 100,
      min: 1
    },
    gradePoint: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E', 'F'],
      required: [false, 'Please provide a grade point']
    },
    gradePercentage: {
      type: Number,
      required: [false, 'Please provide grade percentage'],
      min: 0,
      max: 100
    },
    examType: {
      type: String,
      enum: ['midterm', 'final', 'unit-test', 'periodic-test', 'assignment'],
      required: [false, 'Please provide exam type']
    },
    examDate: {
      type: Date,
      required: [false, 'Please provide exam date']
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500
    },
    recordedBy: {
      type: String,
      trim: true,
      required: [false, 'Please provide who recorded the grade']
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
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Grade', gradeSchema);
