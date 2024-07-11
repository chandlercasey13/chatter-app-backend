const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Messages = require("../models/message.js");
const router = express.Router();

router.use(verifyToken);

module.exports = router;