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
    const filteredChats = await Chatlog.findById(chatId).sort({createdAt: -1}).populate([
      "participants",
      "messages",
    ])
   

    res.json(filteredChats);
  } catch (error) {
    
    res.json(error);
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userChats = await Chatlog.find({
      participants: userId,
    }).sort({updatedAt: -1}).populate("participants")
    .populate("messages")
    


    res.json(userChats);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/new/:userId", async (req, res) => {

  try {
    

    const existLog = await Chatlog.exists({participants: req.params.userId})
    const existsLog = await Chatlog.exists({participants: req.body.participants[1]._id})

    if (existLog && existsLog){
      console.log('exists')
      res.status(200).json(existLog)
    } else {
      const newChatlog = await Chatlog.create(req.body);
      res.status(200).json(newChatlog)
    }


   

  } catch (error) {
    console.log(error);
  }
});

router.put("/:chatId", async (req, res) => {
  try {
    const chatlog = await Chatlog.findById(req.params.chatId);
    
    chatlog.messages.push(req.body.messageId);
    await chatlog.save();
    
    console.log(req.body)

    res.status(200).json(chatlog);
  } catch (error) {
    console.log(error);
  }
});




module.exports = router;
