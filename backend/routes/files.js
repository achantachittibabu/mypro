const express = require('express');
const router = express.Router();
const File = require('../models/File');
const logger = require('../utils/logger');

// GET all files
router.get('/', async (req, res) => {
  try {
    const files = await File.find();
    logger.info('Retrieved all files', { count: files.length });
    res.json({
      success: true,
      data: files,
      count: files.length
    });
  } catch (error) {
    logger.error('Error retrieving files', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET file by ID
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET files by userUnId
router.get('/user/:userUnId', async (req, res) => {
  try {
    const files = await File.find({ userUnId: req.params.userUnId });
    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No files found for this user'
      });
    }
    res.json({
      success: true,
      data: files,
      count: files.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new file
router.post('/', async (req, res) => {
  try {
    const { userUnId, fileUnId, filename, filepath, filesize, lastupdateby } = req.body;

    // Validate required fields
    if (!userUnId || !fileUnId) {
      logger.warn('File creation validation failed', { userUnId, fileUnId });
      return res.status(400).json({
        success: false,
        message: 'userUnId and fileUnId are required'
      });
    }

    const file = await File.create({
      userUnId,
      fileUnId,
      filename,
      filepath,
      filesize,
      lastupdateby,
      createdate: new Date(),
      lastupdate: new Date()
    });

    if (!file || !file._id) {
      logger.error('File record was not inserted into database', { userUnId, fileUnId, filename });
      return res.status(500).json({
        success: false,
        message: 'File could not be created'
      });
    }

    logger.info('File record saved successfully', { fileid: file._id, userUnId, filename });
    res.status(201).json({
      success: true,
      message: 'File created successfully',
      data: file
    });
  } catch (error) {
    logger.error('File record was not inserted into database - save operation failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE file
router.put('/:id', async (req, res) => {
  try {
    const { filename, filepath, filesize, lastupdateby } = req.body;

    const file = await File.findByIdAndUpdate(
      req.params.id,
      {
        filename,
        filepath,
        filesize,
        lastupdateby,
        lastupdate: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!file) {
      logger.warn('File not found for update', { fileId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    logger.info('File record updated successfully', { fileId: req.params.id });
    res.json({
      success: true,
      message: 'File updated successfully',
      data: file
    });
  } catch (error) {
    logger.error('Error updating file', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE file
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// COPY file to home
router.post('/copy-home', async (req, res) => {
  try {
    const { userUnId, filename, filesize, lastupdateby } = req.body;

    // Validate required fields
    if (!userUnId || !filename) {
      logger.warn('File copy validation failed', { userUnId, filename });
      return res.status(400).json({
        success: false,
        message: 'userUnId and filename are required'
      });
    }

    const file = await File.create({
      userUnId,
      filename,
      filesize: filesize || 0,
      lastupdateby,
      createdate: new Date(),
      lastupdate: new Date()
    });

    if (!file || !file._id) {
      logger.error('File record was not inserted into database - copy to home failed', { userUnId, filename });
      return res.status(500).json({
        success: false,
        message: 'File could not be copied'
      });
    }

    logger.info('File record saved successfully - copy to home', { fileid: file._id, userUnId, filename });
    res.status(201).json({
      success: true,
      message: 'File copied to home successfully',
      data: file
    });
  } catch (error) {
    logger.error('File record was not inserted into database - copy operation failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
