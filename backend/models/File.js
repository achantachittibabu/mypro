const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    userUnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user unique ID']
    },
    fileUnId: {
      type: String,
      unique: true,
      trim: true,
      default: null
    },
    filename: {
      type: String,
      trim: true
    },
    filepath: {
      type: String,
      trim: true
    },
    filesize: {
      type: Number,
      default: 0
    },
    // Profile Picture Fields
    profilePicFilePath: {
      type: String,
      trim: true,
      default: null
    },
    profilePicFileName: {
      type: String,
      trim: true,
      default: null
    },
    // Aadhar Card Fields
    aadharCardFilePath: {
      type: String,
      trim: true,
      default: null
    },
    aadharCardFileName: {
      type: String,
      trim: true,
      default: null
    },
    // Additional Documents
    additionalDocuments: [
      {
        filepath: {
          type: String,
          trim: true
        },
        filename: {
          type: String,
          trim: true
        },
        originalname: {
          type: String,
          trim: true
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    lastupdate: {
      type: Date,
      default: Date.now
    },
    createdate: {
      type: Date,
      default: Date.now
    },
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

// ===== PRE-SAVE HOOK: AUTO-GENERATE FILE UNIQUE ID =====
fileSchema.pre('save', function(next) {
  if (!this.fileUnId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    this.fileUnId = `file_${timestamp}${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('File', fileSchema);
