const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const logger = require('../utils/logger');
const { request } = require('http');

// Create posts upload directory if it doesn't exist
const postsDir = path.join(__dirname, '../uploads/posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
  logger.info(`Created directory: ${postsDir}`);
}

// Configure multer for post image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('Post image destination function called', {
      fieldname: file.fieldname,
      filename: file.originalname
    });
    cb(null, postsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'post-' + uniqueSuffix + path.extname(file.originalname);
    logger.info('Post image filename function called', {
      originalName: file.originalname,
      generatedFilename: filename
    });
    cb(null, filename);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/octet-stream'];
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
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP'));
  }
};

// Create upload middleware for post images


const upload = require('../config/multer');

router.post('/', upload.any(), async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    const files = req.files || [];

    logger.info('Create post request', {
      body: req.body,
      fileCount: files.length
    });

    // validation
    if (!title || !content) {
      deleteUploadedFiles(files);
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // base post object
    const postData = {
      title: title.trim(),
      content: content.trim(),
      category: category || 'general',
      priority: priority || 'medium'
    };

    // ⭐ HANDLE IMAGE (first uploaded file)
    if (files.length > 0) {
      const file = files[0];

      postData.image = {
        filename: file.filename,
        filepath: `/uploads/posts/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size
      };

      logger.info('Image uploaded', { file: file.filename });
    }

    const post = await Post.create(postData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error) {
    deleteUploadedFiles(req.files);
    logger.error('Post creation failed', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating post'
    });
  }
});

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    logger.info('Retrieved all posts', { count: posts.length });
    res.json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    logger.error('Error retrieving posts', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    logger.info('Retrieved post by ID', { postId: req.params.id });
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    logger.error('Error retrieving post', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT - Update a post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;

    // Find the existing post
    let post = await Post.findById(req.params.id);
    if (!post) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) logger.error('Error deleting post image file', err);
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Update fields
    if (title) post.title = title.trim();
    if (content) post.content = content.trim();
    if (category) post.category = category.trim();
    if (priority) post.priority = priority;

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (post.image && post.image.filename) {
        const oldImagePath = path.join(__dirname, '../uploads/posts', post.image.filename);
        fs.unlink(oldImagePath, (err) => {
          if (err) logger.error('Error deleting old post image', err);
        });
      }

      // Add new image
      post.image = {
        filename: req.file.filename,
        filepath: `/uploads/posts/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
      logger.info('Post image updated', { filename: req.file.filename });
    }

    await post.save();

    logger.info('Post updated successfully', { postId: post._id });
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    logger.error('Error updating post', error.message);

    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error('Error deleting post image file', err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error updating post'
    });
  }
});

// DELETE - Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Delete associated image file
    if (post.image && post.image.filename) {
      const imagePath = path.join(__dirname, '../uploads/posts', post.image.filename);
      fs.unlink(imagePath, (err) => {
        if (err) logger.error('Error deleting post image file', err);
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    logger.info('Post deleted successfully', { postId: req.params.id });
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting post', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
