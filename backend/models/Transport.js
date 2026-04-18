const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema(
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
    studentName: {
      type: String,
      trim: true,
      required: false
    },
    class: {
      type: String,
      trim: true,
      required: false
    },
    routeNumber: {
      type: String,
      trim: true,
      required: false
    },
    routeName: {
      type: String,
      trim: true,
      required: false
    },
    busNumber: {
      type: String,
      trim: true,
      required: false
    },
    driverName: {
      type: String,
      trim: true,
      required: false
    },
    driverPhone: {
      type: String,
      trim: true,
      required: false
    },
    pickupPoint: {
      type: String,
      trim: true,
      required: false
    },
    pickupTime: {
      type: String,
      required: false
    },
    dropPoint: {
      type: String,
      trim: true,
      required: false
    },
    dropTime: {
      type: String,
      required: false
    },
    fee: {
      type: Number,
      required: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
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

module.exports = mongoose.model('Transport', transportSchema);
