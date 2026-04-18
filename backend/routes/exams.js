const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all exams with optional filtering by userid, year, and month
router.get('/', async (req, res) => {
  try {
    const { userid, year, month } = req.query;
    let filter = {};
    // Filter by year and month if provided
    if (year && month) {
      const startDate = new Date(year, month - 1, 1); // month is 1-indexed in request
      const endDate = new Date(year, month, 0, 23, 59, 59); // last day of month
      
      filter.examDate = {
        $gte: startDate,
        $lte: endDate
      };
      
      logger.info('Filtering exams by date range', { 
        year, 
        month, 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString() 
      });
    }

    const exams = await Exam.find(filter);
    
    logger.info('Retrieved exams', { 
      count: exams.length, 
      userid, 
      year, 
      month 
    });

    res.json({
      success: true,
      data: exams,
      count: exams.length,
      filters: { userid, year, month }
    });
  } catch (error) {
    logger.error('Error retrieving exams', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const exams = await Exam.find({ username: req.params.username });
    if (exams.length === 0) {
      return res.status(404).json({ success: false, message: 'No exams found' });
    }
    res.json({ success: true, data: exams, count: exams.length });
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
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    logger.info('Exam record saved successfully', { examid: exam._id });
    res.status(201).json({ success: true, message: 'Exam created successfully', data: exam });
  } catch (error) {
    logger.error('Exam record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) {
      logger.warn('Exam not found for update', { examId: req.params.id });
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    logger.info('Exam record updated successfully', { examid: req.params.id });
    res.json({ success: true, message: 'Exam updated successfully', data: exam });
  } catch (error) {
    logger.error('Error updating exam', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:examid', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.examid)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const exam = await Exam.findByIdAndDelete(req.params.examid);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, message: 'Exam deleted successfully', data: exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
