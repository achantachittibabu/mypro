const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all timetables
router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find();
    res.json({
      success: true,
      data: timetables,
      count: timetables.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const timetables = await Timetable.find({ username: req.params.username });
    if (timetables.length === 0) {
      return res.status(404).json({ success: false, message: 'No timetables found' });
    }
    res.json({ success: true, data: timetables, count: timetables.length });
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
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }
    res.json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    logger.info('Timetable record saved successfully', { timetableid: timetable._id });
    res.status(201).json({ success: true, message: 'Timetable created successfully', data: timetable });
  } catch (error) {
    logger.error('Timetable record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!timetable) {
      logger.warn('Timetable not found for update', { timetableId: req.params.id });
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }
    logger.info('Timetable record updated successfully', { timetableid: req.params.id });
    res.json({ success: true, message: 'Timetable updated successfully', data: timetable });
  } catch (error) {
    logger.error('Error updating timetable', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }
    res.json({ success: true, message: 'Timetable deleted successfully', data: timetable });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
