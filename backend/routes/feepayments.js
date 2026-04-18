const express = require('express');
const router = express.Router();
const FeePayment = require('../models/FeePayment');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET all fee payments
router.get('/', async (req, res) => {
  try {
    const payments = await FeePayment.find();
    res.json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET by username
router.get('/username/:username', async (req, res) => {
  try {
    const payments = await FeePayment.find({ username: req.params.username });
    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: 'No fee payments found' });
    }
    res.json({ success: true, data: payments, count: payments.length });
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
    const payment = await FeePayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const payment = new FeePayment(req.body);
    await payment.save();
    logger.info('Fee payment record saved successfully', { paymentid: payment._id });
    res.status(201).json({ success: true, message: 'Fee payment created successfully', data: payment });
  } catch (error) {
    logger.error('Fee payment record was not inserted into database', { error: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const payment = await FeePayment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payment) {
      logger.warn('Fee payment not found for update', { paymentId: req.params.id });
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    logger.info('Fee payment record updated successfully', { paymentid: req.params.id });
    res.json({ success: true, message: 'Fee payment updated successfully', data: payment });
  } catch (error) {
    logger.error('Error updating fee payment', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const payment = await FeePayment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Fee payment not found' });
    }
    res.json({ success: true, message: 'Fee payment deleted successfully', data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
