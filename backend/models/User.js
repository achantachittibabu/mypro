const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
     usertype: {
      type: String,
      required: [true, 'Please provide a user type'],
      enum: ['student', 'teacher', 'admin', 'parent'],
      default: 'student'
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

// Generate userId before saving
userSchema.pre('save', async function(next) {
  // Generate userId if not exists
  if (!this.userid && this.usertype) {
    const prefixes = {
      student: 'st',
      teacher: 'te',
      admin: 'ad',
      parent: 'pr'
    };

    const prefix = prefixes[this.usertype];
    
    // Get count of users with this userType to generate unique number
    const count = await this.constructor.countDocuments({ usertype: this.usertype });
    const number = (count + 1).toString().padStart(9, '0');
    
    this.userid = prefix + number;
  }

  // Hash password if modified
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
