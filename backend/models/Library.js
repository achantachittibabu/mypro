const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema(
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
    bookId: {
      type: String,
      trim: true,
      required: false
    },
    bookTitle: {
      type: String,
      trim: true,
      required: false
    },
    author: {
      type: String,
      trim: true,
      required: false
    },
    isbn: {
      type: String,
      trim: true,
      required: false
    },
    publisher: {
      type: String,
      trim: true,
      required: false
    },
    edition: {
      type: String,
      trim: true,
      required: false
    },
    category: {
      type: String,
      trim: true,
      required: false
    },
    availableCopies: {
      type: Number,
      required: false
    },
    totalCopies: {
      type: Number,
      required: false
    },
    issueDate: {
      type: Date,
      required: false
    },
    returnDate: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      enum: ['available', 'issued', 'returned', 'reserved'],
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

module.exports = mongoose.model('Library', librarySchema);
