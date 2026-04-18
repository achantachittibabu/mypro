const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Address = require('../models/Address');
const Parent = require('../models/Parent');
const File = require('../models/File');
const logger = require('../utils/logger');

// Setup multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads');
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
    const generatedFilename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
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
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      logger.info('File accepted by fileFilter', { fieldname: file.fieldname, mimetype: file.mimetype });
      cb(null, true);
    } else {
      logger.error('File rejected by fileFilter - invalid mimetype', { fieldname: file.fieldname, mimetype: file.mimetype, allowed: allowedMimes });
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF'));
    }
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    logger.info('Retrieved all users', { count: users.length });
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    logger.error('Error retrieving users', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      logger.warn('User not found', { userId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    logger.info('Retrieved user', { userId: req.params.id });
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error retrieving user', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE new user with multiple file support
router.post('/', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'documents', maxCount: 100 }
]), async (req, res) => {
  const createdDocuments = {
    user: null,
    profile: null,
    presentaddress: null,
    permanentaddress: null,
    parent: null,
    file: null
  };

  const uploadedFiles = [];

  try {
    logger.info('User creation request received', {
      contentType: req.headers['content-type'],
      hasBody: !!req.body,
      bodyFields: Object.keys(req.body || {}).length,
      hasFiles: !!req.files,
      filesCount: Object.keys(req.files || {}).length,
      documentsCount: req.files?.documents?.length || 0
    });

    // Destructure all fields from request body
    const {
      username,
      email,
      phone,
      password,
      confirmPassword,
      userType,
      // Personal Information
      firstName,
      lastName,
      dateOfBirth,
      aadharNumber,
      contactNumber,
      dateOfJoin,
      grade,
      class: classValue,
      classTeacher,
      // Parent Information
      fatherName,
      motherName,
      fatherAadharNumber,
      motherAadharNumber,
      fatherOccupation,
      // Present Address
      presentHouseNo,
      presentStreet,
      presentArea,
      presentLandmark,
      presentDistrict,
      presentState,
      presentPincode,
      presentPhone,
      sameAddress,
      // Permanent Address
      permanentHouseNo,
      permanentStreet,
      permanentArea,
      permanentLandmark,
      permanentDistrict,
      permanentState,
      permanentPincode,
      permanentPhone
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !confirmPassword || !userType) {
      logger.warn('User creation validation failed - missing required fields', {
        hasUsername: !!username,
        hasEmail: !!email,
        hasPassword: !!password,
        hasConfirmPassword: !!confirmPassword,
        hasUserType: !!userType
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, email, password, confirmPassword, userType'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn('User creation failed - user already exists', { email, username });
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      logger.warn('User creation validation failed - passwords do not match', { email });
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone,
      password,
      userType,
      isActive: true,
      createdAt: new Date()
    });

    const savedUser = await newUser.save();
    createdDocuments.user = savedUser._id;
    logger.info('New user created and saved successfully', {
      userid: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      userType: savedUser.userType
    });

    // Create Profile
    const profile = new Profile({
      userUnId: savedUser._id.toString(),
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth || null,
      aadharNumber: aadharNumber || '',
      contactNumber: contactNumber || '',
      dateOfJoin: dateOfJoin || null,
      grade: grade || '',
      class: classValue || '',
      classTeacher: classTeacher || '',
      creationdate: new Date(),
      lastupdateddate: new Date(),
      lastupdatedby: username
    });

    const savedProfile = await profile.save();
    createdDocuments.profile = savedProfile._id;
    logger.info('Profile record created successfully', {
      profileid: savedProfile._id,
      userid: savedUser._id,
      firstName: profile.firstName,
      lastName: profile.lastName
    });

    // Create Present Address
    const presentaddress = new Address({
      userUnId: savedUser._id.toString(),
      houseNo: presentHouseNo || '',
      streetName: presentStreet || '',
      areaName: presentArea || '',
      landmark: presentLandmark || '',
      districtName: presentDistrict || '',
      stateName: presentState || '',
      pincode: presentPincode || '',
      phoneNumber: presentPhone || '',
      addressType: 'present',
      creationdate: new Date(),
      lastupdateddate: new Date(),
      lastupdatedby: username
    });

    const savedPresentAddress = await presentaddress.save();
    createdDocuments.presentaddress = savedPresentAddress._id;
    logger.info('Present address record saved successfully', {
      addressid: savedPresentAddress._id,
      userid: savedUser._id,
      addressType: 'present'
    });

    // Create Permanent Address only if sameAddress is false
    if (sameAddress === 'false' || sameAddress === false) {
      const permanentaddress = new Address({
        userUnId: savedUser._id.toString(),
        houseNo: permanentHouseNo || '',
        streetName: permanentStreet || '',
        areaName: permanentArea || '',
        landmark: permanentLandmark || '',
        districtName: permanentDistrict || '',
        stateName: permanentState || '',
        pincode: permanentPincode || '',
        phoneNumber: permanentPhone || '',
        addressType: 'permanent',
        creationdate: new Date(),
        lastupdateddate: new Date(),
        lastupdatedby: username
      });

      const savedPermanentAddress = await permanentaddress.save();
      createdDocuments.permanentaddress = savedPermanentAddress._id;
      logger.info('Permanent address record saved successfully', {
        addressid: savedPermanentAddress._id,
        userid: savedUser._id,
        addressType: 'permanent'
      });
    } else {
      logger.info('Skipped permanent address creation - sameAddress is checked', { userid: savedUser._id });
    }

    // Create Parent info if student
    if (userType === 'student') {
      const parent = new Parent({
        userUnId: savedUser._id.toString(),
        fatherName: fatherName || '',
        motherName: motherName || '',
        fatherAadharNumber: fatherAadharNumber || '',
        motherAadharNumber: motherAadharNumber || '',
        fatherOccupation: fatherOccupation || '',
        creationdate: new Date(),
        lastupdateddate: new Date(),
        lastupdatedby: username
      });

      const savedParent = await parent.save();
      createdDocuments.parent = savedParent._id;
      logger.info('Parent record created successfully', {
        parentid: savedParent._id,
        userid: savedUser._id,
        fatherName: parent.fatherName
      });
    }

    // Process uploaded files
    let profilePicPath = null;
    let aadharCardPath = null;
    let additionalDocumentPaths = [];

    if (req.files && Object.keys(req.files).length > 0) {
      logger.info('Files detected in request', {
        userid: savedUser._id,
        files: Object.keys(req.files),
        profilePicExists: !!req.files.profilePic,
        aadharCardExists: !!req.files.aadharCard,
        documentsCount: req.files?.documents?.length || 0
      });

      // Process profile picture
      if (req.files?.profilePic && req.files.profilePic.length > 0) {
        const profilePicFile = req.files.profilePic[0];
        profilePicPath = profilePicFile.path;
        uploadedFiles.push(profilePicPath);
        logger.info('Profile picture file processed', {
          userid: savedUser._id,
          filename: profilePicFile.filename,
          size: profilePicFile.size,
          path: profilePicPath
        });
      }

      // Process aadhar card
      if (req.files?.aadharCard && req.files.aadharCard.length > 0) {
        const aadharCardFile = req.files.aadharCard[0];
        aadharCardPath = aadharCardFile.path;
        uploadedFiles.push(aadharCardPath);
        logger.info('Aadhar card file processed', {
          userid: savedUser._id,
          filename: aadharCardFile.filename,
          size: aadharCardFile.size,
          path: aadharCardPath
        });
      }

      // Process multiple documents
      if (req.files?.documents && req.files.documents.length > 0) {
        logger.info('Processing multiple documents', {
          userid: savedUser._id,
          documentsCount: req.files.documents.length
        });

        req.files.documents.forEach((doc, index) => {
          additionalDocumentPaths.push({
            path: doc.path,
            filename: doc.filename,
            originalname: doc.originalname
          });
          uploadedFiles.push(doc.path);
          logger.info('Document processed', {
            userid: savedUser._id,
            index,
            filename: doc.filename,
            size: doc.size,
            path: doc.path
          });
        });
      }
    } else {
      logger.info('No files in request', { userid: savedUser._id });
    }

    // Create file record if any files were uploaded
    if (profilePicPath || aadharCardPath || additionalDocumentPaths.length > 0) {
      logger.info('Creating file records', {
        userid: savedUser._id,
        hasProfilePic: !!profilePicPath,
        hasAadharCard: !!aadharCardPath,
        documentsCount: additionalDocumentPaths.length
      });

      const fileData = {
        userUnId: savedUser._id,
        profilePicFilePath: profilePicPath || null,
        profilePicFileName: req.files?.profilePic?.[0]?.filename || null,
        aadharCardFilePath: aadharCardPath || null,
        aadharCardFileName: req.files?.aadharCard?.[0]?.filename || null,
        additionalDocuments: additionalDocumentPaths.map(doc => ({
          filePath: doc.path,
          fileName: doc.filename,
          originalName: doc.originalname
        })),
        creationdate: new Date(),
        lastupdateddate: new Date(),
        lastupdatedby: username
      };

      const fileRecord = new File(fileData);
      const savedFileRecord = await fileRecord.save();
      createdDocuments.file = savedFileRecord._id;
      logger.info('File records saved successfully', {
        fileid: savedFileRecord._id,
        userid: savedUser._id,
        profilePicFileName: fileData.profilePicFileName,
        aadharCardFileName: fileData.aadharCardFileName,
        documentsCount: fileData.additionalDocuments.length
      });
    }

    // Return success response
    logger.info('User registration completed successfully', {
      userid: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      hasFiles: uploadedFiles.length > 0,
      filesCount: uploadedFiles.length
    });

    res.status(201).json({
      success: true,
      message: 'User registration successful',
      data: {
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          userType: savedUser.userType
        },
        createdDocuments
      }
    });

  } catch (error) {
    logger.error('User creation error', {
      message: error.message,
      stack: error.stack,
      filesUploaded: uploadedFiles.length
    });

    // Cleanup: Delete uploaded files on error
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((filePath) => {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info('Uploaded file deleted during error cleanup', { filePath });
          }
        } catch (cleanupError) {
          logger.error('Error deleting file during cleanup', {
            filePath,
            error: cleanupError.message
          });
        }
      });
    }

    // Cleanup: Delete created database documents on error
    try {
      if (createdDocuments.user) await User.findByIdAndDelete(createdDocuments.user);
      if (createdDocuments.profile) await Profile.findByIdAndDelete(createdDocuments.profile);
      if (createdDocuments.presentaddress) await Address.findByIdAndDelete(createdDocuments.presentaddress);
      if (createdDocuments.permanentaddress) await Address.findByIdAndDelete(createdDocuments.permanentaddress);
      if (createdDocuments.parent) await Parent.findByIdAndDelete(createdDocuments.parent);
      if (createdDocuments.file) await File.findByIdAndDelete(createdDocuments.file);
      logger.info('Database cleanup completed on error');
    } catch (cleanupError) {
      logger.error('Error during database cleanup', { error: cleanupError.message });
    }

    res.status(400).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, firstName, lastName, phone, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn('User not found for update', { userId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    logger.info('User record updated and saved successfully', { userid: req.params.id, username: user.username });

    logger.info('User updated successfully', { userId: req.params.id });
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Error updating user', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      logger.warn('User not found for deletion', { userId: req.params.id });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info('User deleted successfully', { userId: req.params.id });
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    logger.error('Error deleting user', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// LOGIN endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password, usertype } = req.body;

    if (!username || !password) {
      logger.warn('Login attempt with missing credentials', { username });
      return res.status(400).json({
        success: false,
        message: 'username and password are required'
      });
    }

    const user = await User.findOne({ username, usertype }).select('+password');
    if (!user) {
      logger.warn('Login failed: User not found', { username, usertype });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials-user not found'
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      logger.warn('Login failed: Invalid password', { username });
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check for profile picture in public/profile folder
    let profilePicture = null;
    let profilePictureBase64 = null;
    let profilePictureType = null;
    const publicProfileDir = path.join(__dirname, '../public/profile');
    
    try {
      // List all files in the profile directory
      if (fs.existsSync(publicProfileDir)) {
        const files = fs.readdirSync(publicProfileDir);
        
        // Look for file that starts with the username
        const profileFile = files.find(file => file.startsWith(username));
        
        if (profileFile) {
          const fullPath = path.join(publicProfileDir, profileFile);
          profilePicture = `/public/profile/${profileFile}`;
          
          // Read the image file and convert to base64
          try {
            const imageBuffer = fs.readFileSync(fullPath);
            profilePictureBase64 = imageBuffer.toString('base64');
            
            // Determine MIME type based on file extension
            const ext = path.extname(profileFile).toLowerCase();
            const mimeTypes = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif'
            };
            profilePictureType = mimeTypes[ext] || 'image/jpeg';
            
            logger.info('Profile picture found and encoded', { 
              username, 
              profileFile, 
              path: profilePicture,
              mimeType: profilePictureType,
              size: imageBuffer.length
            });
          } catch (readError) {
            logger.warn('Error reading profile picture file', { 
              username, 
              file: profileFile, 
              error: readError.message 
            });
          }
        } else {
          logger.info('No profile picture found for user', { username });
        }
      } else {
        logger.info('Profile directory does not exist', { path: publicProfileDir });
      }
    } catch (picError) {
      logger.warn('Error retrieving profile picture', { username, error: picError.message });
    }

    logger.info('User login successful', { username, usertype, hasProfilePic: !!profilePictureBase64 });
    res.json({
      success: true,
      message: 'Login successful',
      userid: user.userid,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      profilePicture: profilePicture,
      profilePictureBase64: profilePictureBase64,
      profilePictureType: profilePictureType
    });
  } catch (error) {
    logger.error('Error during login', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
