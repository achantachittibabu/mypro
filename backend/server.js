const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const HOST = 'localhost';
const PORT = 5000;
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
app.use(cors());
// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoDB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schooldb';
    
    await mongoose.connect(mongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/health', require('./routes/health'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/profiles', require('./routes/profile'));
app.use('/api/fees', require('./routes/feeDetails'));
app.use('/api/address', require('./routes/address'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/timetables', require('./routes/timetable'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/library', require('./routes/library'));
app.use('/api/feepayments', require('./routes/feepayments'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/files', require('./routes/files'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/menuitems', require('./routes/menuitems'));
app.use('/api/contactDetails', require('./routes/contactDetails'));
app.use('/api/awards', require('./routes/awards'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/classes', require('./routes/classes'));

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ReactNative Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Log specific multer errors
  if (err.name === 'MulterError') {
    console.error('MULTER ERROR:', {
      code: err.code,
      message: err.message,
      field: err.field,
      limit: err.limit,
      count: err.count,
      expected: err.expected
    });
    
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ 
        message: 'File is too large',
        error: `Max file size: ${err.limit} bytes`,
        code: err.code
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Too many files uploaded',
        error: `Cannot upload more than ${err.expected} files`,
        code: err.code
      });
    }
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message,
      code: err.code
    });
  }
  
  // Log file filter errors
  if (err.message && err.message.includes('Invalid file type')) {
    console.error('FILE FILTER ERROR:', err.message);
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
