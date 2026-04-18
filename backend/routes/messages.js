const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const messages = await Message.find({ username: req.params.username });
    if (messages.length === 0) {
      return res.status(404).json({ success: false, message: 'No messages found' });
    }
    res.json({ success: true, data: messages, count: messages.length });
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
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    logger.info('Message record saved successfully', { messageid: message._id });
    res.status(201).json({ success: true, message: 'Message created successfully', data: message });
  } catch (error) {
    logger.error('Message record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!message) {
      logger.warn('Message not found for update', { messageId: req.params.id });
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    logger.info('Message record updated successfully', { messageid: req.params.id });
    res.json({ success: true, message: 'Message updated successfully', data: message });
  } catch (error) {
    logger.error('Error updating message', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully', data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
