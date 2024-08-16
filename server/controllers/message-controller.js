const Message = require("../models/message-model");
const Chat = require("../models/chat-model");
const ApiError = require("../exceptions/api-error");
const { default: mongoose } = require("mongoose");

class MessageController {
	async createMessage(message) {
		const {text, userId, chatId, time} = message;
		const createdMessage = new Message({
			messageText: text,
			chat: chatId,
			user: userId,
			timestamp: time || Date.now
		});
		let chat;
		try {
			chat = await Chat.findById(chatId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!chat) {
			return next(
				ApiError.searchError({model: 'chat', name: 'id', value: chatId})
			)
		}

		try {
			const session = await mongoose.startSession();
			session.startTransaction();
			await createdMessage.save({session});
			chat.messages.push(createdMessage);
			await chat.save({session});
			await session.commitTransaction();
		} catch (error) {
			console.log(error);
			return next(error);
		}
		res.status(201).json({message: "Message created"});
	}

	async updateMessage(req, res, next) {
		const {text} = req.body;
		const messageId = req.params.mid;
		try {
			const updatedMessage = await Message.findById(messageId);
			if (!updatedMessage) {
				return next(
					ApiError.searchError({ model: 'message', name: 'id', value: messageId })
				)
			}
			updatedMessage.messageText = text;
			await updatedMessage.save();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(200).json({message: "Message updated"});
	}

	async deleteMessage(req, res, next) {
		let messageId = req.params.mid;
		let message;
		try {
			message = await Message.findById(messageId).populate('chat');
		} catch (error) {
			console.log(error);
			return next(error);
		}

		try {
			if (!!message) {
				const session = await mongoose.startSession();
				session.startTransaction();
				await message.deleteOne({
					session: session
				});
				await message.chat.messages.pull(message);
				await message.chat.save({ session });
				await session.commitTransaction();
			} else {
				throw new Error("Can not delete non-existent file");
			}
		} catch (error) {
			return next(error);
		}

		res.status(200).json({ message: "Message successfully deleted" });
	}
}

module.exports = new MessageController();