const quotableService = require("../services/quotable-service");
const chatController = require("../controllers/chat-controller");
const messageController = require("../controllers/message-controller");

let userChats = {};

module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('New client connected');

		socket.on('sendMessage', async (messageData) => {
			const message = await messageController.createMessage(messageData);
			io.emit('message', message);

			// Notify all clients
			io.emit('notification', { chatId: messageData.chatId, message: message.text });
		});

		socket.on('createChat', async (chatData) => {
			const chat = await chatController.createChat(chatData);
			io.emit('chatCreated', chat);
		});

		socket.on('deleteChat', async (chatId) => {
			await chatController.deleteChat(chatId);
			io.emit('chatDeleted', chatId);
		});

		socket.on('searchChat', async (userId, query) => {
			const chats = await chatController.getUserChats(userId);
			const chat = chats.foreach((chat) => {
				if (chat.name === query || chat.constantName === query) return chat;
			});
			socket.emit('searchResults', chat);
		});

		socket.on('disconnect', () => {
			console.log('Client disconnected');
		});
	});
}