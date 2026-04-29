const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Award = require('../models/Award');
const logger = require('../utils/logger');

// Create awards upload directories if they don't exist
const awardsDir = path.join(__dirname, '../uploads/awards');
const certificateDir = path.join(awardsDir, 'certificates');
const photoDir = path.join(awardsDir, 'photos');

[awardsDir, certificateDir, photoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created directory: ${dir}`);
  }
});

// Configure multer for certificate uploads
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('Certificate destination function called', {
      fieldname: file.fieldname,
      filename: file.originalname
    });
    cb(null, certificateDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'certificate-' + uniqueSuffix + path.extname(file.originalname);
    logger.info('Certificate filename function called', {
      originalName: file.originalname,
      generatedFilename: filename
    });
    cb(null, filename);
  }
});

// Configure multer for photo uploads
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('Photo destination function called', {
      fieldname: file.fieldname,
      filename: file.originalname
    });
    cb(null, photoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'photo-' + uniqueSuffix + path.extname(file.originalname);
    logger.info('Photo filename function called', {
      originalName: file.originalname,
      generatedFilename: filename
    });
    cb(null, filename);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/octet-stream'];
  if (allowedMimes.includes(file.mimetype)) {
    logger.info('Image file accepted by fileFilter', {
      fieldname: file.fieldname,
      mimetype: file.mimetype
    });
    cb(null, true);
  } else {
    logger.error('Image file rejected by fileFilter - invalid mimetype', {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      allowed: allowedMimes
    });
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF'));
  }
};

// Create upload middleware for multiple files
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'certificateImage') {
        cb(null, certificateDir);
      } else if (file.fieldname === 'photo') {
        cb(null, photoDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: imageFileFilter
});

// POST - Create a new award with file uploads
router.post('/', upload.fields([
  { name: 'certificateImage', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, recipientName, recipientType, awardDate, awardedBy } = req.body;

    // Validate required fields
    if (!title || !category || !recipientName || !recipientType || !awardDate || !awardedBy) {
      logger.warn('Award creation validation failed', {
        title,
        category,
        recipientName,
        recipientType,
        awardDate,
        awardedBy
      });

      // Clean up uploaded files if validation fails
      if (req.files) {
        if (req.files.certificateImage) {
          fs.unlink(req.files.certificateImage[0].path, (err) => {
            if (err) logger.error('Error deleting certificate file', err);
          });
        }
        if (req.files.photo) {
          fs.unlink(req.files.photo[0].path, (err) => {
            if (err) logger.error('Error deleting photo file', err);
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, category, recipientName, recipientType, awardDate, awardedBy'
      });
    }

    // Create award object
    const awardData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category.trim(),
      recipientName: recipientName.trim(),
      recipientType,
      awardDate: new Date(awardDate),
      awardedBy: awardedBy.trim()
    };

    // Add file information if uploaded
    if (req.files && req.files.certificateImage) {
      const certFile = req.files.certificateImage[0];
      awardData.certificateImage = {
        filename: certFile.filename,
        filepath: `/uploads/awards/certificates/${certFile.filename}`,
        mimetype: certFile.mimetype,
        size: certFile.size
      };
      logger.info('Certificate image uploaded', { filename: certFile.filename });
    }

    if (req.files && req.files.photo) {
      const photoFile = req.files.photo[0];
      awardData.photo = {
        filename: photoFile.filename,
        filepath: `/uploads/awards/photos/${photoFile.filename}`,
        mimetype: photoFile.mimetype,
        size: photoFile.size
      };
      logger.info('Photo uploaded', { filename: photoFile.filename });
    }

    // Create and save award
    const award = new Award(awardData);
    await award.save();

    logger.info('Award created successfully', { awardId: award._id });
    res.status(201).json({
      success: true,
      message: 'Award created successfully',
      data: award
    });
  } catch (error) {
    logger.error('Error creating award', error.message);

    // Clean up uploaded files if error occurs
    if (req.files) {
      if (req.files.certificateImage) {
        fs.unlink(req.files.certificateImage[0].path, (err) => {
          if (err) logger.error('Error deleting certificate file', err);
        });
      }
      if (req.files.photo) {
        fs.unlink(req.files.photo[0].path, (err) => {
          if (err) logger.error('Error deleting photo file', err);
        });
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating award'
    });
  }
});

// GET all awards
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    logger.info('Retrieved all awards', { count: awards.length });
    res.json({
      success: true,
      data: awards,
      count: awards.length
    });
  } catch (error) {
    logger.error('Error retrieving awards', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET award by ID
router.get('/:id', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }
    logger.info('Retrieved award by ID', { awardId: req.params.id });
    res.json({
      success: true,
      data: award
    });
  } catch (error) {
    logger.error('Error retrieving award', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET awards by recipient type
router.get('/type/:recipientType', async (req, res) => {
  try {
    const awards = await Award.find({ recipientType: req.params.recipientType }).sort({ createdAt: -1 });
    if (awards.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No awards found for recipient type: ${req.params.recipientType}`
      });
    }
    logger.info('Retrieved awards by type', { recipientType: req.params.recipientType, count: awards.length });
    res.json({
      success: true,
      data: awards,
      count: awards.length
    });
  } catch (error) {
    logger.error('Error retrieving awards by type', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET awards by recipient name
router.get('/recipient/:recipientName', async (req, res) => {
  try {
    const awards = await Award.find({
      recipientName: new RegExp(req.params.recipientName, 'i')
    }).sort({ createdAt: -1 });

    if (awards.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No awards found for recipient: ${req.params.recipientName}`
      });
    }
    logger.info('Retrieved awards by recipient name', { recipientName: req.params.recipientName, count: awards.length });
    res.json({
      success: true,
      data: awards,
      count: awards.length
    });
  } catch (error) {
    logger.error('Error retrieving awards by recipient', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE award by ID
router.put('/:id', upload.fields([
  { name: 'certificateImage', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      // Clean up files if award not found
      if (req.files) {
        if (req.files.certificateImage) {
          fs.unlink(req.files.certificateImage[0].path, (err) => {
            if (err) logger.error('Error deleting certificate file', err);
          });
        }
        if (req.files.photo) {
          fs.unlink(req.files.photo[0].path, (err) => {
            if (err) logger.error('Error deleting photo file', err);
          });
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    // Update fields
    const { title, description, category, recipientName, recipientType, awardDate, awardedBy } = req.body;

    if (title) award.title = title.trim();
    if (description) award.description = description.trim();
    if (category) award.category = category.trim();
    if (recipientName) award.recipientName = recipientName.trim();
    if (recipientType) award.recipientType = recipientType;
    if (awardDate) award.awardDate = new Date(awardDate);
    if (awardedBy) award.awardedBy = awardedBy.trim();

    // Handle certificate image update
    if (req.files && req.files.certificateImage) {
      // Delete old certificate if exists
      if (award.certificateImage && award.certificateImage.filename) {
        const oldPath = path.join(certificateDir, award.certificateImage.filename);
        fs.unlink(oldPath, (err) => {
          if (err) logger.error('Error deleting old certificate file', err);
        });
      }

      const certFile = req.files.certificateImage[0];
      award.certificateImage = {
        filename: certFile.filename,
        filepath: `/uploads/awards/certificates/${certFile.filename}`,
        mimetype: certFile.mimetype,
        size: certFile.size
      };
      logger.info('Certificate image updated', { filename: certFile.filename });
    }

    // Handle photo update
    if (req.files && req.files.photo) {
      // Delete old photo if exists
      if (award.photo && award.photo.filename) {
        const oldPath = path.join(photoDir, award.photo.filename);
        fs.unlink(oldPath, (err) => {
          if (err) logger.error('Error deleting old photo file', err);
        });
      }

      const photoFile = req.files.photo[0];
      award.photo = {
        filename: photoFile.filename,
        filepath: `/uploads/awards/photos/${photoFile.filename}`,
        mimetype: photoFile.mimetype,
        size: photoFile.size
      };
      logger.info('Photo updated', { filename: photoFile.filename });
    }

    award.updatedAt = new Date();
    await award.save();

    logger.info('Award updated successfully', { awardId: award._id });
    res.json({
      success: true,
      message: 'Award updated successfully',
      data: award
    });
  } catch (error) {
    logger.error('Error updating award', error.message);

    // Clean up uploaded files if error occurs
    if (req.files) {
      if (req.files.certificateImage) {
        fs.unlink(req.files.certificateImage[0].path, (err) => {
          if (err) logger.error('Error deleting certificate file', err);
        });
      }
      if (req.files.photo) {
        fs.unlink(req.files.photo[0].path, (err) => {
          if (err) logger.error('Error deleting photo file', err);
        });
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error updating award'
    });
  }
});

// DELETE award by ID
router.delete('/:id', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    // Delete associated files
    if (award.certificateImage && award.certificateImage.filename) {
      const certPath = path.join(certificateDir, award.certificateImage.filename);
      fs.unlink(certPath, (err) => {
        if (err) logger.error('Error deleting certificate file', err);
      });
    }

    if (award.photo && award.photo.filename) {
      const photoPath = path.join(photoDir, award.photo.filename);
      fs.unlink(photoPath, (err) => {
        if (err) logger.error('Error deleting photo file', err);
      });
    }

    await Award.findByIdAndDelete(req.params.id);

    logger.info('Award deleted successfully', { awardId: req.params.id });
    res.json({
      success: true,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting award', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
