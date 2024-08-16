const mongoose = require("mongoose");

const quotableService = require("../services/quotable-service");
const User = require("../models/user-model");
const Chat = require("../models/chat-model");
const Message = require("../models/message-model");
const ApiError = require("../exceptions/api-error");

class ChatController {
	async searchAuthors (req, res, next) {
		try {
			const { query } = req.params.query;
			const authors = await quotableService.searchAuthor(query);
			if (!authors && authors.results.length < 1) {
				throw ApiError.BadAPIRequest("Cannot find author")
			}
			res.status(200).json({result: authors.results})
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}

	async createChat(req, res, next) {
		const { query, userId } = req.body;

		let author;
		try {
			author = await quotableService.searchAuthor(query).results[0];
		} catch (error) {
			console.log(error);
			return next(error);
		}

		let chat;
		try {
			chat = await Chat.findOne({ constantName: query });	
		} catch (error) {
			console.log(error);
			return next(error)
		}

		const newChat = new Chat({
			user: userId, name: author.name, constantName: author.name
		});

		let user;
		try {
			user = await User.findById(userId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!user) {
			return next(
				ApiError.searchError({model: "user", name: 'id', value: userId})
			)
		}

		let isChatExists = false;

		if (user && chat) {
			user.chats.forEach((chatId) => isChatExists = chatId === chat._id);
		}

		if (isChatExists) throw new ApiError(400, "Cannot create existed chat");

		try {
			const session = await mongoose.startSession();
			session.startTransaction();
			await newChat.save();
			await user.chats.push(newChat);
			await user.save({session});
			await session.commitTransaction()
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(201).json({isSuccess: true, message: "Chat successfully created", chat: newChat.toObject({getters: true})});
	}

	async updateChat(req, res, next) {
		const { name } = req.body;
		const chatId = req.params.cid;

		let updatedChat;
		try {
			updatedChat = await Chat.findById(chatId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!updatedChat) {
			return next(
				ApiError.searchError({model: 'chat', name: 'id', value: chatId})
			);
		}

		updatedChat.name = name;

		try {
			await updatedChat.save();
		} catch (error) {
			console.log(error);
			return next(error);
		}
		res.status(200).json({ chat: updatedChat.toObject({ getters: true }) });
	}

	async deleteChat(req, res, next) {
		const chatId = req.params.cid
		let chat;
		try {
			chat = await Chat.findById(chatId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!chat) {
			return next(
				ApiError.searchError({ model: 'chat', name: 'id', value: chatId })
			)
		}
		
		try {
			const session = mongoose.startSession();
			session.startTransaction();
			await Message.deleteMany({chat: chatId});
			await chat.deleteOne({session: session});
			await chat.user.chats.pull(chat);
			await chat.user.save({session});
			await session.commitTransaction();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(200).json({message: "Chat has been deleted"});
	}

	async clearChat(req, res, next) {
		const chatId = req.params.cid;
		let chat;
		try {
			chat = await Chat.findById(chatId);
		} catch (error) {
			return next(error);
		}

		if (!chat) {
			return next(
				ApiError.searchError({ model: 'chat', name: 'id', value: chatId })
			)
		}

		try {
			await Message.deleteMany({chat: chat._id});
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(200).json({message: "Chat has been cleared"});
	}

	async getUserChats(req, res, next) {
		const { userId } = req.params.uid;
		let user;
		try {
			user = await User.findById(userId);
		} catch (error) {
			console.log(error);
			return next(error);
		}

		if (!user) {
			return next(
				ApiError.searchError({ model:"user", name: 'id', value: userId })
			)
		}

		let userChats;
		try {
			userChats = await Chat.select('_id name constantName messages').where('_id').in(user.chats).exec();
		} catch (error) {
			console.log(error);
			return next(error);
		}

		res.status(200).json({chats: userChats});
	}
}

module.exports = new ChatController();