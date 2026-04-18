const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      trim: true,
      required: false
    },
    description: {
      type: String,
      trim: true,
      required: false
    },
    class: {
      type: String,
      trim: true,
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
    dueDate: {
      type: Date,
      required: false
    },
    marks: {
      type: Number,
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded', 'overdue'],
      required: false
    },
    attachmentUrl: {
      type: String,
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

module.exports = mongoose.model('Assignment', assignmentSchema);
