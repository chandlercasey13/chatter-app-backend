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
      "messages.senderId",
    ]);
    res.status(500).json(error);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;
