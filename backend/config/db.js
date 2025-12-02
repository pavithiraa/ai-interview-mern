const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("MongoDB connected!!");
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectToDB;
