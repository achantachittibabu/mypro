const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
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
    settingType: {
      type: String,
      trim: true,
      required: false
    },
    settingKey: {
      type: String,
      trim: true,
      required: false
    },
    settingValue: {
      type: String,
      trim: true,
      required: false
    },
    category: {
      type: String,
      trim: true,
      required: false
    },
    description: {
      type: String,
      trim: true,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true,
      required: false
    },
    isPublic: {
      type: Boolean,
      default: false,
      required: false
    },
    notificationEnabled: {
      type: Boolean,
      default: true,
      required: false
    },
    emailEnabled: {
      type: Boolean,
      default: true,
      required: false
    },
    smsEnabled: {
      type: Boolean,
      default: false,
      required: false
    },
    language: {
      type: String,
      trim: true,
      required: false
    },
    theme: {
      type: String,
      trim: true,
      required: false
    },
    timezone: {
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

module.exports = mongoose.model('Setting', settingSchema);
