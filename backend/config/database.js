const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up change streams for real-time updates
    const db = mongoose.connection.db;
    const changeStream = db.collection('processed_messages').watch();
    
    return { connection: conn, changeStream };
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
