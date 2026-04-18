const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const User = require('../models/User');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Helper function to check if string is valid MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET all grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find().populate('username', 'userType');
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET grades by username
router.get('/username/:username', async (req, res) => {
  try {
    const grades = await Grade.find({ username: req.params.username }).populate('student', 'username email');
    if (grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No grades found for this username'
      });
    }
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET grades by userType
router.get('/usertype/:usertype', async (req, res) => {
  try {
    const grades = await Grade.find({ userType: req.params.usertype }).populate('student', 'username email');
    if (grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No grades found for this user type'
      });
    }
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET grades by class
router.get('/class/:class', async (req, res) => {
  try {
    const grades = await Grade.find({ class: req.params.class }).populate('student', 'username email');
    if (grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No grades found for this class'
      });
    }
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET grade by ID
router.get('/:id', async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grade ID format. Please provide a valid MongoDB ObjectId'
      });
    }

    const grade = await Grade.findById(req.params.id).populate('student', 'username email');
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    res.json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new grade
router.post('/', async (req, res) => {
  try {
    const {
      student,
      username,
      userType,
      class: gradeClass,
      section,
      subject,
      marksObtained,
      totalMarks,
      gradePoint,
      gradePercentage,
      examType,
      examDate,
      remarks,
      recordedBy
    } = req.body;

    // Validation
    if (!username || !userType || !gradeClass || !subject || marksObtained === undefined || !gradePoint || gradePercentage === undefined || !examType || !examDate) {
      logger.warn('Grade creation validation failed', { username, userType, subject });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: username, userType, class, subject, marksObtained, gradePoint, gradePercentage, examType, examDate'
      });
    }

    // Try to find student by username if student ObjectId is not provided
    let studentObjectId = student;
    if (!student || !isValidObjectId(student)) {
      try {
        const foundUser = await User.findOne({ username });
        if (foundUser) {
          studentObjectId = foundUser._id;
        } else {
          logger.warn('User not found for grade creation', { username });
          studentObjectId = null;
        }
      } catch (error) {
        logger.warn('Could not look up user for grade creation', { username, error: error.message });
        studentObjectId = null;
      }
    }

    // Calculate grade percentage if not provided
    let finalGradePercentage = gradePercentage;
    if (!finalGradePercentage && totalMarks) {
      finalGradePercentage = (marksObtained / totalMarks) * 100;
    }

    const grade = new Grade({
      student: studentObjectId,
      username,
      userType,
      class: gradeClass,
      section,
      subject,
      marksObtained,
      totalMarks: totalMarks || 100,
      gradePoint,
      gradePercentage: finalGradePercentage,
      examType,
      examDate,
      remarks,
      recordedBy
    });

    await grade.save();
    logger.info('Grade record saved successfully', { gradeid: grade._id, username, subject });

    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      data: grade
    });
  } catch (error) {
    logger.error('Grade record was not inserted into database', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE grade by ID
router.put('/:id', async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grade ID format. Please provide a valid MongoDB ObjectId'
      });
    }

    const {
      marksObtained,
      totalMarks,
      gradePoint,
      gradePercentage,
      remarks,
      recordedBy
    } = req.body;

    const updateFields = {};

    if (marksObtained !== undefined) updateFields.marksObtained = marksObtained;
    if (totalMarks !== undefined) updateFields.totalMarks = totalMarks;
    if (gradePoint !== undefined) updateFields.gradePoint = gradePoint;
    if (gradePercentage !== undefined) {
      updateFields.gradePercentage = gradePercentage;
    } else if (marksObtained !== undefined && totalMarks !== undefined) {
      updateFields.gradePercentage = (marksObtained / totalMarks) * 100;
    }
    if (remarks !== undefined) updateFields.remarks = remarks;
    if (recordedBy !== undefined) updateFields.recordedBy = recordedBy;
    updateFields.updatedAt = Date.now();

    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!grade) {
      logger.warn('Grade not found for update', { gradeId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    logger.info('Grade record updated successfully', { gradeid: req.params.id });
    res.json({
      success: true,
      message: 'Grade updated successfully',
      data: grade
    });
  } catch (error) {
    logger.error('Error updating grade', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE grade by ID
router.delete('/:id', async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid grade ID format. Please provide a valid MongoDB ObjectId'
      });
    }

    const grade = await Grade.findByIdAndDelete(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.json({
      success: true,
      message: 'Grade deleted successfully',
      data: grade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET grades by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId }).populate('student', 'username email');
    if (grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No grades found for this student'
      });
    }
    res.json({
      success: true,
      data: grades,
      count: grades.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
