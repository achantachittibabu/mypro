const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an award title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true
    },
    recipientName: {
      type: String,
      required: [true, 'Please provide recipient name'],
      trim: true
    },
    recipientType: {
      type: String,
      enum: ['student', 'teacher', 'staff', 'admin'],
      required: [true, 'Please provide recipient type']
    },
    awardDate: {
      type: Date,
      required: [true, 'Please provide an award date']
    },
    awardedBy: {
      type: String,
      required: [true, 'Please provide who awarded this'],
      trim: true
    },
    certificateImage: {
      filename: String,
      filepath: String,
      mimetype: String,
      size: Number
    },
    photo: {
      filename: String,
      filepath: String,
      mimetype: String,
      size: Number
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

module.exports = mongoose.model('Award', awardSchema);
