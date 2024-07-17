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

router.get("/:userId", async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const filteredChats = await Chatlog.find({
      participants: { $all: [userId1, userId2] },
    });

    res.json(filteredChats);
  } catch (error) {
    console.log(error);
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
    console.log(chatlog);
    chatlog.messages.push(req.body.messageId);
    await chatlog.save();

    res.status(200).json(chatlog);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
