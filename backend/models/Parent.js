const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    // ===== UNIQUE IDENTIFIERS =====
    parentUnId: {
      type: String,
      unique: true,
      trim: true,
      default: null
    },

    userUnId: {
      type: String,
      required: [true, 'User unique ID is required'],
      trim: true
    },

    // ===== FATHER INFORMATION =====
    fatherName: {
      type: String,
      trim: true
    },

    fatherAadharNumber: {
      type: String,
      sparse: true,
      trim: true,
      validate: {
        validator: function(value) {
          return !value || /^\d{12}$/.test(value);
        },
        message: 'Father Aadhar card must be 12 digits'
      }
    },

    fatherOccupation: {
      type: String,
      trim: true
    },

    // ===== MOTHER INFORMATION =====
    motherName: {
      type: String,
      trim: true
    },

    motherAadharNumber: {
      type: String,
      sparse: true,
      trim: true,
      validate: {
        validator: function(value) {
          return !value || /^\d{12}$/.test(value);
        },
        message: 'Mother Aadhar number must be 12 digits'
      }
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

// ===== PRE-SAVE HOOK: AUTO-GENERATE PARENT UNIQUE ID =====
parentSchema.pre('save', function(next) {
  if (!this.parentUnId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    this.parentUnId = `parent_${timestamp}${randomStr}`;
  }
  next();
});

// ===== PRE-SAVE HOOK: UPDATE LAST UPDATED DATE =====
parentSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastupdateddate = new Date();
  }
  next();
});

// ===== INDEXES FOR EFFICIENT QUERIES =====
parentSchema.index({ parentUnId: 1 });
parentSchema.index({ userUnId: 1 });
parentSchema.index({ fatherAadharNumber: 1 });
parentSchema.index({ motherAadharNumber: 1 });
parentSchema.index({ creationdate: 1 });

module.exports = mongoose.model('ParentDetails', parentSchema);
