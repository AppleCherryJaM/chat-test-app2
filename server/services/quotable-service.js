const axios = require("axios");
// const ApiError = require("../exceptions/api-error");

const API_URL = process.env.QUOTABLE_API;

const apiServer = axios.create({
	baseURL: API_URL
});

const searchAuthor = async (query) => {
	const author = await apiServer.get(`/search/authors?query=${query}`); //returning array
	return author;
}

const getRandomQuote = async () => {
	const result = await apiServer.get("/quotes/random");
	return result;
}

const getAuthorsList = async() => {
	const result = await apiServer.get('/search/authors').results;
	return result;
}

const searchAuthorsQuotes = async (query) => {
	const result = await apiServer.get(`/search/quotes?query=${query}&fields=author`);
	return result;
}

module.exports = { searchAuthor, searchAuthorsQuotes, getRandomQuote, getAuthorsList };