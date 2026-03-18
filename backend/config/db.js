const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: "majority",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.warn("Warning: Starting server without database connection. API will return errors until DB connects.");
    return false;
  }
};

module.exports = connectDB;
