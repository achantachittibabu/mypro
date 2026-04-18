const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const File = require('../models/File');

// Setup multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads/photos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('Multer destination function called', { 
      fieldname: file.fieldname, 
      filename: file.originalname,
      uploadsDir: uploadsDir
    });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const generatedFilename = 'photo-' + uniqueSuffix + path.extname(file.originalname);
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
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/octet-stream'];
    if (allowedMimes.includes(file.mimetype)) {
      logger.info('File accepted by fileFilter', { fieldname: file.fieldname, mimetype: file.mimetype });
      cb(null, true);
    } else {
      logger.error('File rejected by fileFilter - invalid mimetype', { fieldname: file.fieldname, mimetype: file.mimetype, allowed: allowedMimes });
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF'));
    }
  }
});

// Setup multer for profile picture uploads
const publicProfileDir = path.join(__dirname, '../public/profile');
if (!fs.existsSync(publicProfileDir)) {
  fs.mkdirSync(publicProfileDir, { recursive: true });
}

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('Profile pic destination function called', { 
      fieldname: file.fieldname, 
      filename: file.originalname,
      directory: publicProfileDir
    });
    cb(null, publicProfileDir);
  },
  filename: (req, file, cb) => {
    const { username } = req.body;
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = username + ext;
    logger.info('Profile pic filename function called', { 
      originalName: file.originalname,
      generatedFilename: filename,
      username: username
    });
    cb(null, filename);
  }
});

const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    logger.info('Profile pic fileFilter called', { 
      fieldname: file.fieldname, 
      filename: file.originalname, 
      mimetype: file.mimetype, 
      size: file.size 
    });
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      logger.info('Profile pic file accepted by fileFilter', { fieldname: file.fieldname, mimetype: file.mimetype });
      cb(null, true);
    } else {
      logger.error('Profile pic file rejected by fileFilter - invalid mimetype', { fieldname: file.fieldname, mimetype: file.mimetype, allowed: allowedMimes });
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF'));
    }
  }
});

// POST - Upload photos
router.post('/upload', upload.array('photos', 100), async (req, res) => {
  try {
    logger.info('Photo upload request received', { 
      contentType: req.headers['content-type'], 
      filesCount: req.files ? req.files.length : 0
    });

    if (!req.files || req.files.length === 0) {
      logger.warn('No files uploaded');
      return res.status(400).json({
        success: false,
        message: 'No photos provided'
      });
    }

    const uploadedPhotos = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    logger.info('Photos uploaded successfully', { 
      count: uploadedPhotos.length,
      files: uploadedPhotos.map(p => p.filename)
    });

    res.status(201).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: {
        count: uploadedPhotos.length,
        photos: uploadedPhotos
      }
    });
  } catch (error) {
    logger.error('Error uploading photos', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photos: ' + error.message
    });
  }
});

// GET - Get all photos
router.get('/', async (req, res) => {
  try {
    logger.info('Retrieving all photos');
    
    // Retrieve file records from File table
    const fileRecords = await File.find();
    logger.info('Retrieved file records from database', { 
      count: fileRecords.length,
      records: fileRecords
    });
    
    const photoFiles = fs.readdirSync(uploadsDir);
    const photos = photoFiles.map((filename) => ({
      filename: filename,
      path: `/uploads/photos/${filename}`,
      uploadedAt: fs.statSync(path.join(uploadsDir, filename)).birthtime
    }));

    logger.info('Retrieved photos', { count: photos.length });

    res.json({
      success: true,
      data: photos,
      count: photos.length,
      fileRecords: fileRecords
    });
  } catch (error) {
    logger.error('Error retrieving photos', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve photos: ' + error.message
    });
  }
});

// POST - Update profile picture
router.post('/update-profile-pic', uploadProfilePic.single('profilePicture'), async (req, res) => {
  try {
    const {image, username, userid } = req.body;

    if (!username) {
      logger.warn('Profile pic update: Missing username', {});
      return res.status(400).json({
        success: false,
        message: 'username is required'
      });
    }

    if (!image) {
      logger.warn('Profile pic update: No file uploaded', { username, userid });
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // If file was uploaded successfully, multer already replaced any existing file
    // because the filename is based on username only
    const profilePicPath = `/public/profile/${req.file.filename}`;
    
    logger.info('Profile picture updated successfully', {
      userid,
      username,
      filename: req.file.filename,
      path: profilePicPath,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Read the file and convert to base64 for immediate response
    let profilePictureBase64 = null;
    let profilePictureType = null;

    try {
      const imageBuffer = fs.readFileSync(req.file.path);
      profilePictureBase64 = imageBuffer.toString('base64');
      
      // Determine MIME type
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
      };
      const ext = path.extname(req.file.filename).toLowerCase();
      profilePictureType = mimeTypes[ext] || 'image/jpeg';
      
      logger.info('Profile picture encoded for response', {
        userid,
        username,
        mimeType: profilePictureType
      });
    } catch (readError) {
      logger.warn('Error reading profile picture for response', {
        userid,
        username,
        error: readError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        userid: userid,
        username: username,
        filename: req.file.filename,
        path: profilePicPath,
        size: req.file.size,
        mimetype: req.file.mimetype,
        profilePictureBase64: profilePictureBase64,
        profilePictureType: profilePictureType
      }
    });
  } catch (error) {
    logger.error('Error updating profile picture', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile picture: ' + error.message
    });
  }
});

// GET - Get photo by filename
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const photoPath = path.join(uploadsDir, filename);

    logger.info('Requesting photo', { filename, path: photoPath });

    if (!fs.existsSync(photoPath)) {
      logger.warn('Photo not found', { filename });
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    res.sendFile(photoPath);
  } catch (error) {
    logger.error('Error retrieving photo', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve photo: ' + error.message
    });
  }
});

// DELETE - Delete photo
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const photoPath = path.join(uploadsDir, filename);

    logger.info('Deleting photo', { filename, path: photoPath });

    if (!fs.existsSync(photoPath)) {
      logger.warn('Photo not found for deletion', { filename });
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    fs.unlinkSync(photoPath);
    logger.info('Photo deleted successfully', { filename });

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting photo', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete photo: ' + error.message
    });
  }
});

module.exports = router;
