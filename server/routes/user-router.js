const router = new require("express").Router();
const {check} = require('express-validator');

const controller = require("../controllers/user-controller");

router.post("/login", controller.login);

router.post(
	"/signup", 
	controller.signup,
	check("firstName", 'Name cannot be empty')
		.notEmpty(),
	check("lastName", 'Surname cannot be empty')
		.notEmpty(),
	check("email")
		.notEmpty()
		.withMessage("Email cannot be empty")
		.isEmail()
		.withMessage("Invalid email"),
	check("password")
		.notEmpty()
		.withMessage("Password cannot be empty")
		.isLength({min: 5, max: 10})
		.withMessage("Password should contain 5-10 symbols")
);

router.get('/users', controller.getUsers);

module.exports = router;