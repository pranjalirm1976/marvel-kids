const mongoose = require("mongoose");

// Fail fast instead of buffering model operations while disconnected.
mongoose.set("bufferCommands", false);

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const connectDB = async () => {
  let retryDelay = 1000;

  while (mongoose.connection.readyState !== 1) {
    if (!process.env.MONGO_URI) {
      console.error("MongoDB connection unavailable: MONGO_URI is not configured.");
    } else {
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
        console.error(`MongoDB connection failed: ${err.message}`);
      }
    }

    console.warn(`Retrying MongoDB connection in ${Math.round(retryDelay / 1000)} seconds.`);
    await wait(retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30000);
  }

  return true;
};

module.exports = connectDB;
