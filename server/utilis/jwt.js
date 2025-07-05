/** @format */

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const createToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			role: user.role,
		},
		secret,
		{ expiresIn: "7d" }
	);
};

const verifyToken = (token) => {
	return jwt.verify(token, secret);
};

module.exports = { createToken, verifyToken };
