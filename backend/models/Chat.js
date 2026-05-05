const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: String,
  formal: String,
  informal: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);