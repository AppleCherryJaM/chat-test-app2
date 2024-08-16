const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const chatSchema = new Schema({
	user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
	name: { type: String, required: true },
	constantName: { type: String, required: true },
	messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }]
});

module.exports = model("Chat", chatSchema);