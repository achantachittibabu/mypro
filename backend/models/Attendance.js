const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a student'],
    },
    class: {
      type: String,
      required: [true, 'Please provide a class'],
      trim: true
    },
    section: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now
    },
    status: {
      type: String,
      required: [true, 'Please provide attendance status'],
      enum: ['present', 'absent', 'late', 'excused', 'half-day'],
      default: 'present'
    },
    userType: {
      type: String,
      ref: 'User',
      enum: ['teacher', 'admin', 'student'],
      required: [true, 'Please provide who marked the attendance']
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500
    },
    username: {
      ref: 'User',
      type: String,
      trim: true,
      maxlength: 500
    },
    timeIn: {
      type: String,
      trim: true
    },
    timeOut: {
      type: String,
      trim: true
    },
    period: {
      type: Number,
      min: 1,
      max: 10
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
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for efficient queries
attendanceSchema.index({ student: 1, date: 1, subject: 1 });
attendanceSchema.index({ class: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });

// Virtual for attendance percentage
attendanceSchema.virtual('isPresent').get(function() {
  return this.status === 'present' || this.status === 'late';
});

// Static method to get student attendance percentage
attendanceSchema.statics.getAttendancePercentage = async function(studentId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        student: mongoose.Types.ObjectId(studentId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        present: {
          $sum: {
            $cond: [
              { $in: ['$status', ['present', 'late']] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        present: 1,
        percentage: {
          $multiply: [
            { $divide: ['$present', '$total'] },
            100
          ]
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result.length > 0 ? result[0] : { total: 0, present: 0, percentage: 0 };
};

// Static method to get class attendance summary
attendanceSchema.statics.getClassAttendanceSummary = async function(className, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const summary = await this.aggregate([
    {
      $match: {
        class: className,
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return summary;
};

// Method to mark attendance as verified
attendanceSchema.methods.verify = async function(verifiedBy) {
  this.isVerified = true;
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  return await this.save();
};

// Pre-save middleware to ensure no duplicate attendance for same day
attendanceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const startOfDay = new Date(this.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(this.date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await this.constructor.findOne({
      student: this.student,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      subject: this.subject,
      period: this.period
    });

    if (existingAttendance) {
      const error = new Error('Attendance already marked for this student on this date and period');
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);