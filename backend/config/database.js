const mongoose = require('mongoose');

// Database configuration
const dbConfig = {
  local: {
    uri: 'mongodb://localhost:27017/reactnative_app',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  atlas: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    }
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use Atlas by default if MONGODB_URI is set, otherwise use local
    const env = process.env.NODE_ENV === 'production' ? 'atlas' : 'atlas';
    const mongoURI = process.env.MONGODB_URI || dbConfig.local.uri;
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
    
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  dbConfig
};
