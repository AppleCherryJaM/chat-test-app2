const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");

const ApiError = require("../exceptions/api-error");
const User = require("../models/user-model");
const Chat = require("../models/chat-model");
const utils = require("../utils/utils");
const quotableService = require("../services/quotable-service");

const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

class UserController {
	async signup(req, res, next) {
		try {
			const validationErrors = validationResult(req.body);
			if (!validationErrors.isEmpty) {
				throw new ApiError(
					400, `Validation errors`, validationErrors
				);
			}
			const {firstName, lastName, email, password} = req.body;

			if (!utils.validateEmail(email)) {
				throw new ApiError(
					400, `Invalid email`
				);
			}

			const candidate = await User.findOne({email});
			if (candidate) {
				throw new ApiError(
					400, `User with email ${email} exists`
				);
			}

			const authors = await quotableService.getAuthorsList();

			if (!authors && authors.length < 0) {
				throw ApiError.BadAPIRequest("Cannot get authors from API")
			}

			const userChats = [
				new Chat({
					user: user._id,
					name: authors.results[index].name,
					constantName: authors.results[index].name
				}),
				new Chat({
					user: user._id,
					name: authors.results[index].name,
					constantName: authors.results[index].name
				}),
				new Chat({
					user: user._id,
					name: authors.results[index].name,
					constantName: authors.results[index].name
				})
			];

			await Chat.insertMany(userChats);

			let chatIds = [];
			userChats.forEach((chat) => chatIds.push(chat._id));

			const hashPassword = await bcrypt.hash(password, 3);
			const user = new User({
				firstName, lastName, email, password: hashPassword, chats: chatIds
			});
			await user.save();

			return res.status(201).json({message: "User created", user});
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}

	async login(req, res, next) {
		try {
			const validationErrors = validationResult(req.body);
			if (!validationErrors.isEmpty) {
				throw new ApiError(
					400, `Validation errors`, validationErrors
				);
			}

			const { email, password } = req.body;

			if (!utils.validateEmail(email)) {
				throw new ApiError(
					400, `Invalid email`
				);
			}

			const user = await User.findOne({email});
			if (!user) {
				throw ApiError.searchUserError({ name: 'email', value: email })
			}

			const isValidPassword = bcrypt.compareSync(password, user.password);
			if (!isValidPassword) {
				throw new ApiError(
					400, `Invalid password`
				);
			}

			const token = utils.generateAccessToken({ id: user._id, email: user.email }, SECRET_KEY, 24);
			return res.status(200).json({token});
		} catch (error) {
			console.log(error);
			return next(error);
		}
	}
}

module.exports = new UserController();