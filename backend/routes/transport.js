const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all transport records
router.get('/', async (req, res) => {
  try {
    const transports = await Transport.find();
    res.json({
      success: true,
      data: transports,
      count: transports.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const transports = await Transport.find({ username: req.params.username });
    if (transports.length === 0) {
      return res.status(404).json({ success: false, message: 'No transport records found' });
    }
    res.json({ success: true, data: transports, count: transports.length });
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
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Transport record not found' });
    }
    res.json({ success: true, data: transport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const transport = new Transport(req.body);
    await transport.save();
    logger.info('Transport record saved successfully', { transportid: transport._id });
    res.status(201).json({ success: true, message: 'Transport record created successfully', data: transport });
  } catch (error) {
    logger.error('Transport record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transport) {
      logger.warn('Transport not found for update', { transportId: req.params.id });
      return res.status(404).json({ success: false, message: 'Transport record not found' });
    }
    logger.info('Transport record updated successfully', { transportid: req.params.id });
    res.json({ success: true, message: 'Transport record updated successfully', data: transport });
  } catch (error) {
    logger.error('Error updating transport', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Transport record not found' });
    }
    res.json({ success: true, message: 'Transport record deleted successfully', data: transport });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
