const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    // ===== UNIQUE IDENTIFIERS =====
    addressUnId: {
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

    // ===== ADDRESS DETAILS =====
    houseNo: {
      type: String,
      trim: true
    },

    streetName: {
      type: String,
      trim: true
    },

    areaName: {
      type: String,
      trim: true
    },

    landmark: {
      type: String,
      trim: true
    },

    districtName: {
      type: String,
      trim: true
    },

    stateName: {
      type: String,
      trim: true
    },

    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: function(value) {
          return !value || /^\d{6}$/.test(value);
        },
        message: 'Pincode must be 6 digits'
      }
    },

    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(value) {
          return !value || /^\d{10}$/.test(value);
        },
        message: 'Phone number must be 10 digits'
      }
    },

    addressType: {
      type: String,
      enum: ['present', 'permanent'],
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

// ===== PRE-SAVE HOOK: AUTO-GENERATE ADDRESS UNIQUE ID =====
addressSchema.pre('save', function(next) {
  if (!this.addressUnId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    this.addressUnId = `address_${timestamp}${randomStr}`;
  }
  next();
});

// ===== PRE-SAVE HOOK: UPDATE LAST UPDATED DATE =====
addressSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastupdateddate = new Date();
  }
  next();
});

// ===== INDEXES FOR EFFICIENT QUERIES =====
addressSchema.index({ addressUnId: 1 });
addressSchema.index({ userUnId: 1 });
addressSchema.index({ pincode: 1 });
addressSchema.index({ districtName: 1 });
addressSchema.index({ creationdate: 1 });

module.exports = mongoose.model('AddressDetails', addressSchema);
