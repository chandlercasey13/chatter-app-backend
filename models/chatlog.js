const mongoose = require('mongoose');

const chatlogSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Chatlog', chatlogSchema);