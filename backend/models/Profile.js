const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // ===== UNIQUE IDENTIFIERS =====
    profileUnId: {
      type: String,
      unique: true,
      trim: true,
      default: null
    },

    userUnId: {
      type: String,
      required: [true, 'User unique ID is required'],
      unique: true,
      trim: true
    },

    // ===== PERSONAL INFORMATION =====
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true
    },

    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true
    },

    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth']
    },

    aadharNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function(value) {
          return !value || /^\d{12}$/.test(value);
        },
        message: 'Aadhar number must be 12 digits'
      }
    },

    contactNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(value) {
          return !value || /^\d{10}$/.test(value);
        },
        message: 'Contact number must be 10 digits'
      }
    },

    dateOfJoin: {
      type: Date
    },

    grade: {
      type: String,
      trim: true
    },

    class: {
      type: String,
      trim: true
    },

    classTeacher: {
      type: String,
      trim: true
    },

    profilephoto: {
      type: String,
      trim: true
    },

    // ===== AUDIT FIELDS =====
    creationdate: {
      type: Date,
      default: Date.now
    },

    lastupdateddate: {
      type: Date,
      default: Date.now
    },

    lastupdatedby: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// ===== PRE-SAVE HOOK: AUTO-GENERATE PROFILE UNIQUE ID =====
profileSchema.pre('save', function(next) {
  if (!this.profileUnId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    this.profileUnId = `profile_${timestamp}${randomStr}`;
  }
  next();
});

// ===== PRE-SAVE HOOK: UPDATE LAST UPDATED DATE =====
profileSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastupdateddate = new Date();
  }
  next();
});

// ===== INDEXES FOR EFFICIENT QUERIES =====
profileSchema.index({ profileUnId: 1 });
profileSchema.index({ userUnId: 1 });
profileSchema.index({ aadharNumber: 1 });
profileSchema.index({ creationdate: 1 });
profileSchema.index({ lastupdateddate: 1 });

module.exports = mongoose.model('ProfileDetails', profileSchema);
