const mongoose = require("mongoose");

const chatlogSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [], }]
});

module.exports = mongoose.model("Chatlog", chatlogSchema);
