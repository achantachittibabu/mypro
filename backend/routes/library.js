const express = require('express');
const router = express.Router();
const Library = require('../models/Library');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all library records
router.get('/', async (req, res) => {
  try {
    const libraries = await Library.find();
    res.json({
      success: true,
      data: libraries,
      count: libraries.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const libraries = await Library.find({ username: req.params.username });
    if (libraries.length === 0) {
      return res.status(404).json({ success: false, message: 'No library records found' });
    }
    res.json({ success: true, data: libraries, count: libraries.length });
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
    const library = await Library.findById(req.params.id);
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library record not found' });
    }
    res.json({ success: true, data: library });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const library = new Library(req.body);
    await library.save();
    logger.info('Library record saved successfully', { libraryid: library._id });
    res.status(201).json({ success: true, message: 'Library record created successfully', data: library });
  } catch (error) {
    logger.error('Library record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const library = await Library.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!library) {
      logger.warn('Library not found for update', { libraryId: req.params.id });
      return res.status(404).json({ success: false, message: 'Library record not found' });
    }
    logger.info('Library record updated successfully', { libraryid: req.params.id });
    res.json({ success: true, message: 'Library record updated successfully', data: library });
  } catch (error) {
    logger.error('Error updating library', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const library = await Library.findByIdAndDelete(req.params.id);
    if (!library) {
      return res.status(404).json({ success: false, message: 'Library record not found' });
    }
    res.json({ success: true, message: 'Library record deleted successfully', data: library });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
