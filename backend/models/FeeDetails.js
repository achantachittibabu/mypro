const mongoose = require('mongoose');

const feeDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      trim: true
    },
    userType: {
      type: String,
      required: [true, 'Please provide a user type'],
      enum: ['student', 'teacher', 'admin', 'parent'],
      default: 'student'
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    academicYear: {
      type: String,
      required: [true, 'Please provide academic year'],
      default: '2024-2025'
    },
    semester: {
      type: String,
      enum: ['1', '2'],
      default: '1'
    },
    totalFees: {
      type: Number,
      required: [true, 'Please provide total fees'],
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide due date']
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'partial', 'overdue'],
      default: 'pending'
    },
    paymentMode: {
      type: String,
      enum: ['cash', 'card', 'online', 'cheque', 'bank_transfer'],
      trim: true
    },
    transactionId: {
      type: String,
      trim: true
    },
    receiptNumber: {
      type: String,
      trim: true
    },
    feeCategory: {
      type: String,
      enum: ['tuition', 'exam', 'library', 'sports', 'transport', 'hostel', 'other'],
      default: 'tuition'
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
feeDetailsSchema.index({ username: 1, academicYear: 1 });
feeDetailsSchema.index({ paymentStatus: 1 });

// Calculate pending amount before saving
feeDetailsSchema.pre('save', function(next) {
  this.pendingAmount = this.totalFees - this.paidAmount;
  next();
});

module.exports = mongoose.model('FeeDetails', feeDetailsSchema);