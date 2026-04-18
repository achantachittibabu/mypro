const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json({
      success: true,
      data: assignments,
      count: assignments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const assignments = await Assignment.find({ username: req.params.username });
    if (assignments.length === 0) {
      return res.status(404).json({ success: false, message: 'No assignments found' });
    }
    res.json({ success: true, data: assignments, count: assignments.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    logger.info('Assignment record saved successfully', { assignmentid: assignment._id });
    res.status(201).json({ success: true, message: 'Assignment created successfully', data: assignment });
  } catch (error) {
    logger.error('Assignment record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!assignment) {
      logger.warn('Assignment not found for update', { assignmentId: req.params.id });
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    logger.info('Assignment record updated successfully', { assignmentId: req.params.id });
    res.json({ success: true, message: 'Assignment updated successfully', data: assignment });
  } catch (error) {
    logger.error('Error updating assignment', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, message: 'Assignment deleted successfully', data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
