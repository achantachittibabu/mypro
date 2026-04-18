const mongoose = require('mongoose');

// Function to generate unique exam ID
const generateExamId = () => {
  const randomChars = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `exam${randomChars}`;
};

const examSchema = new mongoose.Schema(
  {
    examid: {
          type: String,
          unique: true,
          sparse: true,
          trim: true
        },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'parent'],
      required: false
    },
    examName: {
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
    examDate: {
      type: Date,
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
    maxMarks: {
      type: Number,
      required: false
    },
    duration: {
      type: Number,
      required: false
    },
    examType: {
      type: String,
      enum: ['midterm', 'final', 'unit-test', 'periodic-test'],
      required: false
    },
    syllabus: {
      type: String,
      trim: true,
      required: false
    },
    invigilator: {
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

// Pre-save middleware to auto-generate examid
examSchema.pre('save', function(next) {
  // Only generate examid if it's not already set
  if (!this.examid) {
    this.examid = generateExamId();
  }
  next();
});

module.exports = mongoose.model('Exam', examSchema);
