const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const MyModel = mongoose.model(
  "Users",
  new mongoose.Schema({
    userId: String,
    walletAddress: String,
    privateKey: String,
    mailName: String,
    mailPass: String,
    reward: Number
  })
);

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/streamr", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

// Function to add a document to the MongoDB collection
async function addUser(userId, walletAddress, privateKey, mailName, mailPass, reward) {
  try {
    const document = new MyModel({
      userId,
      walletAddress,
      privateKey,
      mailName,
      mailPass,
      reward
    });

    await document.save();
    console.log("Document added successfully");
    closeConnection();
  } catch (error) {
    console.error("Failed to add document", error);
  }
}

function closeConnection() {
  mongoose.connection
    .close()
    .then(() => console.log("MongoDB connection closed"))
    .catch((error) => console.error("Error closing MongoDB connection", error));
}

// Usage example
module.exports = { connectToMongoDB, addUser };
