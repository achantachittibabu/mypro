const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// GET all attendance records
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find();
    res.json({
      success: true,
      data: attendances,
      count: attendances.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET attendance by ID
router.get('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('student', '-password')
      .populate('markedBy', '-password')
      .populate('verifiedBy', '-password');
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET attendance by userType
router.get('/usertype/:usertype', async (req, res) => {
  try {
    const { usertype } = req.params;
    
    // Validate user type
    const validUserTypes = ['student', 'teacher', 'admin', 'parent'];
    if (!validUserTypes.includes(usertype.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be one of: student, teacher, admin, parent'
      });
    }

    // Find all users with the specified userType
    const users = await User.find({ userType: usertype.toLowerCase() }).select('_id');
    const userTypes = users.map(user => user.userType);

    // Find attendance records for these users
    const attendances = await Attendance.find({ student: { $in: userTypes } })
      .populate('userType', '-password')
      .populate('username', '-password');
    
    res.json({
      success: true,
      data: attendances,
      count: attendances.length,
      usertype: usertype
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET attendance by userType and grade (class)
router.get('/usertype/:usertype/grade/:grade', async (req, res) => {
  try {
    const { usertype, grade } = req.params;
    
    // Validate user type
    const validUserTypes = ['student', 'teacher', 'admin', 'parent'];
    if (!validUserTypes.includes(usertype.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be one of: student, teacher, admin, parent'
      });
    }

    // Find all users with the specified userType
    const users = await User.find({ userType: usertype.toLowerCase() }).select('_id');
    const userIds = users.map(user => user._id);

    // Find attendance records for these users and the specified class/grade
    const attendances = await Attendance.find({ 
      student: { $in: userIds },
      class: grade
    })
      .populate('student', '-password')
      .populate('markedBy', '-password')
      .populate('verifiedBy', '-password');
    
    res.json({
      success: true,
      data: attendances,
      count: attendances.length,
      usertype: usertype,
      grade: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
