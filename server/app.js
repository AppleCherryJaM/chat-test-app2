require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
// const {Server} = require("socket.io");

const userRouter = require("./routes/user-router");
const chatRouter = require("./routes/chat-router");
const socketHandler = require("./socket/socketHandler");

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL
const app = express();

const server = http.createServer(app);
// const socketIo = new Server(server, {
// 	cors: {
// 		origin: "*",
// 		methods: ['GET', 'POST']
// 	}
// });

app.use(express.json());

app.use("/auth", userRouter);
app.use("/user/chats", chatRouter);

app.use((error, req, res, next) => {
	if(res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500).json({
		message: error.message || error.errors ||"Unknown error"
	});
});

// socketHandler(socketIo);

const start = async () => {
	try {
		await mongoose.connect(DB_URL);
		server.listen(PORT, () => {
			console.log("Server started");
		});
	} catch (error) {
		console.log(error);
	}
}

start();