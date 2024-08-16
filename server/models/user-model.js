const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	firstName: { type: 'string', required: true },
	lastName: { type: 'string', required: true },
	email: { type: 'string', required: true, unique: true },
	password: { type: 'string', required: true, minlength: 5 },
	// isActivated: { type: "boolean", default: false },
	// activationLink: { type: 'string' },
	chats: [{ type: mongoose.Types.ObjectId, ref: "Chat" }]
});
// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);