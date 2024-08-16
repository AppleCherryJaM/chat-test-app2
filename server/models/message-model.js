const mongoose = require('mongoose');

const { Schema, model } = mongoose

const messageSchema = new Schema({
	messageText: { type: String, required: true },
	chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
	user: { type: mongoose.Types.ObjectId, ref: "User" },
	timestamp: { type: Date, default: Date.now },
});

module.exports = model("Message", messageSchema);