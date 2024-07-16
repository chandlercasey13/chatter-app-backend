const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Message = require("../models/message.js");
const router = express.Router();
const searchUser = require("./searchUser.js");
const User = require("../models/user");

router.use(verifyToken);

router.get("/users", async (req, res) => {
  try {
    const signedInUserId = req.user._id;
    const allUsers = await User.find();

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/search-user", searchUser);

router.post("/", async (req, res) => {
  try {
    req.body.senderId = req.user._id;
    const message = await Message.create(req.body);
    message._doc.senderId = req.user;

    res.status(201).json(message);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate("senderId")
      .sort({ createdAt: "desc" });
<<<<<<< HEAD

=======
     console.log('message ',messages)
>>>>>>> 14e50e6aecbb9df09efe9aaab8a79d18bdd0cec4
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId).populate([
      "senderId",
      "messages.senderId",
    ]);
    res.status(500).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:messageId", async (req, res) => {
  try {

    const messageSender = await Message.findById(req.params.messageId);
    const messageUserStringified = messageSender.senderId[0].toString()
    
   
    
    const message = await Message.findById(req.params.messageId);
    if (messageUserStringified === req.user._id) {
      
      
    }
    
    
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.messageId,
      req.body,
      { new: true }
    );
    
    updatedMessage._doc.senderId = req.user;
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const messageSender = await Message.findById(req.params.messageId);
<<<<<<< HEAD
    const messageStringified = messageSender.senderId[0].toString();

    if (messageStringified === req.user._id) {
      console.log("this is your message to delete");
=======
    const messageUserStringified = messageSender.senderId[0].toString()
//converted the message sender id to string to make it comparable to req.user_id

    if (messageUserStringified === req.user._id){
     
>>>>>>> 14e50e6aecbb9df09efe9aaab8a79d18bdd0cec4

      const message = await Message.findByIdAndDelete(req.params.messageId);
      res.status(200).json(message);
    } else {
      console.log("this is not your message to delete");
      return res.status(403);
    }

<<<<<<< HEAD
    //converted the message sender id to string to make it comparable to req.user_id
=======
   else {
    
    return res.status(403)
 }



    

  
  
    
    
>>>>>>> 14e50e6aecbb9df09efe9aaab8a79d18bdd0cec4
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
