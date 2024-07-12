const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Message = require("../models/message.js");
const router = express.Router();

router.use(verifyToken);

router.post("/", async (req, res) => {
  try {
    
    req.body.senderId = req.user._id;
    const message = await Message.create(req.body);
    message._doc.senderId = req.user;

    console.log(req.body)
    console.log('req.user', req.user)
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
