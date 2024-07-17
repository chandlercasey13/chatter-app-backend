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
    console.log(req.user._id)
    console.log(req.body)
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



    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId).populate([
      "senderId",
      // "message.senderId",
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
    const messageUserStringified = messageSender.senderId[0].toString()
//converted the message sender id to string to make it comparable to req.user_id

    if (messageUserStringified === req.user._id){
     

      const message = await Message.findByIdAndDelete(req.params.messageId);
      res.status(200).json(message);
    } 

   else {
    
    return res.status(403)
 }



    

  
  
    
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
