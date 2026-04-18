const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const File = require('../models/File');

// Setup multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads/menuitems');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('Multer destination function called for menuitems', { 
      fieldname: file.fieldname, 
      filename: file.originalname,
      uploadsDir: uploadsDir
    });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const generatedFilename = 'menuitem-' + uniqueSuffix + path.extname(file.originalname);
    logger.info('Multer filename function called', { 
      originalName: file.originalname,
      generatedFilename: generatedFilename,
      fieldname: file.fieldname
    });
    cb(null, generatedFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    logger.info('Multer fileFilter called', { 
      fieldname: file.fieldname, 
      filename: file.originalname, 
      mimetype: file.mimetype, 
      size: file.size 
    });
    // Allow all file types for menu items
    cb(null, true);
  }
});

// Upload menu item file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    logger.info('POST /api/menuitems/upload called', { 
      file: req.file,
      body: req.body 
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
        data: {}
      });
    }

    // Create file record in database
    const fileRecord = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      filepath: `/uploads/menuitems/${req.file.filename}`,
      filesize: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    });

    const savedFile = await fileRecord.save();
    logger.info('File record saved to database', { id: savedFile._id, filename: req.file.filename });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: { 
        items: [{
          _id: savedFile._id,
          filename: req.file.filename,
          originalname: req.file.originalname,
          uploadedAt: savedFile.uploadedAt
        }]
      }
    });
  } catch (error) {
    logger.error('Error uploading file:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Upload failed',
      data: {}
    });
  }
});

// Get all menu items
router.get('/', async (req, res) => {
  try {
    logger.info('GET /api/menuitems called');

    const files = await File.find()
      .sort({ uploadedAt: -1 })
      .limit(100);

    logger.info('Files retrieved from database', { count: files.length });

    return res.status(200).json({
      success: true,
      message: 'Menu items fetched successfully',
      data: { 
        items: files.map(f => ({
          _id: f._id,
          filename: f.filename,
          originalname: f.originalname,
          uploadedAt: f.uploadedAt
        }))
      }
    });
  } catch (error) {
    logger.error('Error fetching files:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch menu items',
      data: {}
    });
  }
});

// Get single menu item file
router.get('/:filename', (req, res) => {
  try {
    logger.info('GET /api/menuitems/:filename called', { filename: req.params.filename });

    const filepath = path.join(uploadsDir, req.params.filename);

    if (!fs.existsSync(filepath)) {
      logger.warn('File not found', { filepath: filepath });
      return res.status(404).json({
        success: false,
        message: 'File not found',
        data: {}
      });
    }

    res.download(filepath);
  } catch (error) {
    logger.error('Error downloading file:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Download failed',
      data: {}
    });
  }
});

// Delete menu item file
router.delete('/:fileId', async (req, res) => {
  try {
    logger.info('DELETE /api/menuitems/:fileId called', { fileId: req.params.fileId });

    const fileRecord = await File.findById(req.params.fileId);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File record not found',
        data: {}
      });
    }

    const filepath = path.join(__dirname, '..', fileRecord.filepath);

    // Delete file from server
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      logger.info('File deleted from server', { filepath: filepath });
    }

    // Delete file record from database
    await File.findByIdAndDelete(req.params.fileId);
    logger.info('File record deleted from database', { fileId: req.params.fileId });

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: {}
    });
  } catch (error) {
    logger.error('Error deleting file:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Delete failed',
      data: {}
    });
  }
});

module.exports = router;
