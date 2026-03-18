const mongoose = require("mongoose");

const connectDb = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDb };
