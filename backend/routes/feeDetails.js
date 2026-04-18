const express = require('express');
const router = express.Router();
const FeeDetails = require('../models/FeeDetails');
const logger = require('../utils/logger');

// GET all fee details
router.get('/', async (req, res) => {
  try {
    const fees = await FeeDetails.find();
    res.json({
      success: true,
      data: fees,
      count: fees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET fee details by username
router.get('/:username', async (req, res) => {
  try {
    const fees = await FeeDetails.find({ username: req.params.username });
    res.json({
      success: true,
      data: fees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET fee details by userType
router.get('/:usertype', async (req, res) => {
  try {
    const fees = await FeeDetails.find({ userType: req.params.usertype });
    res.json({
      success: true,
      data: fees,
      count: fees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET fee details by ID
router.get('/:id', async (req, res) => {
  try {
    const fee = await FeeDetails.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee details not found'
      });
    }
    res.json({
      success: true,
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new fee details
router.post('/', async (req, res) => {
  try {
    const fee = new FeeDetails(req.body);
    await fee.save();
    logger.info('Fee details record saved successfully', { feeid: fee._id });
    res.status(201).json({
      success: true,
      message: 'Fee details created successfully',
      data: fee
    });
  } catch (error) {
    logger.error('Fee details record was not inserted into database', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE fee details
router.put('/:id', async (req, res) => {
  try {
    const fee = await FeeDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!fee) {
      logger.warn('Fee details not found for update', { feeId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Fee details not found'
      });
    }
    logger.info('Fee details record updated successfully', { feeid: req.params.id });
    res.json({
      success: true,
      message: 'Fee details updated successfully',
      data: fee
    });
  } catch (error) {
    logger.error('Error updating fee details', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE fee details
router.delete('/:id', async (req, res) => {
  try {
    const fee = await FeeDetails.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee details not found'
      });
    }
    res.json({
      success: true,
      message: 'Fee details deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;