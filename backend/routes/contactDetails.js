const express = require('express');
const router = express.Router();
const ContactDetails = require('../models/ContactDetails');
const logger = require('../utils/logger');

// GET all contact details
router.get('/', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.find();
    logger.info('Retrieved all contact details', { count: contactDetails.length });
    res.json({
      success: true,
      data: contactDetails,
      count: contactDetails.length
    });
  } catch (error) {
    logger.error('Error retrieving contact details', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET contact details by ID
router.get('/:id', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.findById(req.params.id);
    if (!contactDetails) {
      logger.warn('Contact details not found', { contactDetailsId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Contact details not found'
      });
    }
    logger.info('Retrieved contact details by ID', { contactDetailsId: req.params.id });
    res.json({
      success: true,
      data: contactDetails
    });
  } catch (error) {
    logger.error('Error retrieving contact details by ID', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new contact details
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { phoneNumber, emailId, address } = req.body;
    
    if (!phoneNumber || !emailId || !address) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, email ID, and address are required'
      });
    }

    const contactDetails = new ContactDetails(req.body);
    await contactDetails.save();
    logger.info('Contact details record saved successfully', { 
      contactDetailsId: contactDetails._id, 
      phoneNumber: contactDetails.phoneNumber 
    });
    res.status(201).json({
      success: true,
      message: 'Contact details created successfully',
      data: contactDetails
    });
  } catch (error) {
    logger.error('Error creating contact details', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE contact details
router.put('/:id', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contactDetails) {
      logger.warn('Contact details not found for update', { contactDetailsId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Contact details not found'
      });
    }
    logger.info('Contact details record updated successfully', { contactDetailsId: req.params.id });
    res.json({
      success: true,
      message: 'Contact details updated successfully',
      data: contactDetails
    });
  } catch (error) {
    logger.error('Error updating contact details', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE contact details
router.delete('/:id', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.findByIdAndDelete(req.params.id);
    if (!contactDetails) {
      logger.warn('Contact details not found for deletion', { contactDetailsId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Contact details not found'
      });
    }
    logger.info('Contact details record deleted successfully', { contactDetailsId: req.params.id });
    res.json({
      success: true,
      message: 'Contact details deleted successfully',
      data: contactDetails
    });
  } catch (error) {
    logger.error('Error deleting contact details', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
