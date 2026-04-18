const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false
    },
    messagename: {
      type: String,
      trim: true,
      required: false
    },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'parent'],
      required: false
    },
    emailId: {
      type: String,
      trim: true,
      required: true
    },
    recipient: {
      type: String,
      trim: true,
      required: false
    },
    subject: {
      type: String,
      trim: true,
      required: false
    },
    message: {
      type: String,
      trim: true,
      required: false
    },
    messageType: {
      type: String,
      enum: ['personal', 'announcement', 'notification', 'system'],
      required: false
    },
    attachmentUrl: {
      type: String,
      required: false
    },
    isRead: {
      type: Boolean,
      default: false,
      required: false
    },
    readAt: {
      type: Date,
      required: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      required: false
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'archived'],
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

module.exports = mongoose.model('Message', messageSchema);
