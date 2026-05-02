const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
      trim: true
    },
    category: {
      type: String,
      trim: true,
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'medium'
    },
    image: {
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

module.exports = mongoose.model('Post', postSchema);
