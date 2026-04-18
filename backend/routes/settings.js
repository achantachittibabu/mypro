const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json({
      success: true,
      data: settings,
      count: settings.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const settings = await Setting.find({ username: req.params.username });
    if (settings.length === 0) {
      return res.status(404).json({ success: false, message: 'No settings found' });
    }
    res.json({ success: true, data: settings, count: settings.length });
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
    const setting = await Setting.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const setting = new Setting(req.body);
    await setting.save();
    logger.info('Setting record saved successfully', { settingid: setting._id });
    res.status(201).json({ success: true, message: 'Setting created successfully', data: setting });
  } catch (error) {
    logger.error('Setting record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const setting = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!setting) {
      logger.warn('Setting not found for update', { settingId: req.params.id });
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    logger.info('Setting record updated successfully', { settingid: req.params.id });
    res.json({ success: true, message: 'Setting updated successfully', data: setting });
  } catch (error) {
    logger.error('Error updating setting', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const setting = await Setting.findByIdAndDelete(req.params.id);
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, message: 'Setting deleted successfully', data: setting });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
