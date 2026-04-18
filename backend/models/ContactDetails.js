const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema(
  {
    // ===== UNIQUE IDENTIFIERS =====
    contactDetailsUnId: {
      type: String,
      unique: true,
      trim: true,
      default: null
    },

    // ===== CONTACT INFORMATION =====
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please provide a valid phone number']
    },

    emailId: {
      type: String,
      required: [true, 'Email ID is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },

    workingHours: {
      type: String,
      trim: true,
      default: '9:00 AM - 5:00 PM'
    },

    // ===== STATUS =====
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactDetails', contactDetailsSchema);
