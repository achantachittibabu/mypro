const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema(
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
    section: {
      type: String,
      trim: true,
      required: false
    },
    feeType: {
      type: String,
      trim: true,
      required: false
    },
    amount: {
      type: Number,
      required: false
    },
    paidAmount: {
      type: Number,
      required: false
    },
    pendingAmount: {
      type: Number,
      required: false
    },
    dueDate: {
      type: Date,
      required: false
    },
    paymentDate: {
      type: Date,
      required: false
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'cheque', 'online', 'bank-transfer'],
      required: false
    },
    transactionId: {
      type: String,
      trim: true,
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'overdue'],
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

module.exports = mongoose.model('FeePayment', feePaymentSchema);
