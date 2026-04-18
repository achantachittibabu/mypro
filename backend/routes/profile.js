const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const logger = require('../utils/logger');

// GET all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    logger.info('Retrieved all profiles', { count: profiles.length });
    res.json({
      success: true,
      data: profiles,
      count: profiles.length
    });
  } catch (error) {
    logger.error('Error retrieving profiles', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET profile by username
router.get('/:username', async (req, res) => {
  try {
    const profile = await Profile.findOne({ username: req.params.username });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET profiles by userType
router.get('/:usertype', async (req, res) => {
  try {
    const profiles = await Profile.find({ userType: req.params.usertype });
    res.json({
      success: true,
      data: profiles,
      count: profiles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new profile
router.post('/', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    logger.info('Profile record saved successfully', { profileid: profile._id });
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Profile record was not inserted into database', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE profile with combined data (userData, parentData, addressData, documentsData)
router.put('/:id', async (req, res) => {
  try {
    const completeProfileData = req.body;

    // Extract and structure the data from combined object
    const extractedData = {
      // ===== USER DATA =====
      firstName: completeProfileData.firstName,
      lastName: completeProfileData.lastName,
      dateOfBirth: completeProfileData.dateOfBirth,
      aadharNumber: completeProfileData.aadharCard,
      contactNumber: completeProfileData.contactNumber,
      dateOfJoin: completeProfileData.dateOfJoin,
      grade: completeProfileData.grade,
      class: completeProfileData.class,
      classTeacher: completeProfileData.classTeacher,
      profilephoto: completeProfileData.profilephoto,

      // ===== PARENT DATA =====
      fatherName: completeProfileData.fatherName,
      motherName: completeProfileData.motherName,
      fatherAadharCard: completeProfileData.fatherAadharCard,
      motherAadharCard: completeProfileData.motherAadharCard,
      fatherOccupation: completeProfileData.fatherOccupation,

      // ===== PRESENT ADDRESS DATA =====
      presentAddress: {
        houseNo: completeProfileData.presentAddress?.houseNo,
        streetName: completeProfileData.presentAddress?.streetName,
        areaName: completeProfileData.presentAddress?.areaName,
        landmark: completeProfileData.presentAddress?.landmark,
        districtName: completeProfileData.presentAddress?.districtName,
        stateName: completeProfileData.presentAddress?.stateName,
        pincode: completeProfileData.presentAddress?.pincode,
        phoneNumber: completeProfileData.presentAddress?.phoneNumber
      },
      isPresentAddressSameAsPermanent: completeProfileData.isPresentAddressSameAsPermanent,

      // ===== PERMANENT ADDRESS DATA =====
      permanentAddress: completeProfileData.isPresentAddressSameAsPermanent 
        ? completeProfileData.presentAddress 
        : {
            houseNo: completeProfileData.permanentAddress?.houseNo,
            streetName: completeProfileData.permanentAddress?.streetName,
            areaName: completeProfileData.permanentAddress?.areaName,
            landmark: completeProfileData.permanentAddress?.landmark,
            districtName: completeProfileData.permanentAddress?.districtName,
            stateName: completeProfileData.permanentAddress?.stateName,
            pincode: completeProfileData.permanentAddress?.pincode,
            phoneNumber: completeProfileData.permanentAddress?.phoneNumber
          },

      // ===== DOCUMENTS DATA =====
      aadharCardUpload: completeProfileData.aadharCardUpload,
      fatherMotherAadharCardUpload: completeProfileData.fatherMotherAadharCardUpload,

      // ===== PROFILE STATUS =====
      isProfileApproved: completeProfileData.isProfileApproved
    };

    // Update profile with extracted data
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      extractedData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      logger.warn('Profile not found for update', { profileId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    logger.info('Profile record updated successfully', { profileId: req.params.id });
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    logger.error('Error updating profile', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// DELETE profile
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;