const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Message = require("../models/message.js");
const router = express.Router();
const searchUser = require("./searchUser.js");
const User = require("../models/user.js");
const Chatlog = require("../models/chatlog.js");

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const allChatlogs = await Chatlog.find().populate("participants");

    res.status(200).json(allChatlogs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:chatId", async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const filteredChat = await Chatlog.findById(chatId).populate([
      "participants",
      "messages",
    ]);
    console.log(filteredChat);
    res.json(filteredChat);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userChats = await Chatlog.find({
      participants: userId,
    }).populate("participants");
    
    console.log(userChats);
    res.json(userChats);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const chatlog = await Chatlog.create(req.body);

    console.log(chatlog._id);
    // participants
    //messages

    res.status(200).json(chatlog);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:chatId", async (req, res) => {
  try {
    const chatlog = await Chatlog.findById(req.params.chatId);
    
    chatlog.messages.push(req.body.messageId);
    await chatlog.save();
    console.log('updating')
    

    res.status(200).json(chatlog);
  } catch (error) {
    console.log(error);
  }
});




module.exports = router;
