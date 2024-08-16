const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

const generateAccessToken = (user, secret, expiresIn) => {
	const payload = {
		id: user.id, email: user.email
	}
	return jwt.sign(
		payload, secret, { expiresIn }
	);

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

}

module.exports = { validateEmail, generateAccessToken };