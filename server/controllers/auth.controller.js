/** @format */

const bcrypt = require("bcrypt");
const { createToken } = require("../utilis/jwt");
const authService = require("../services/auth.service");

const register = async (req, res) => {
	try {
		const { email, password, role } = req.body;
		const existing = await authService.findUserByEmail(email);
		if (existing)
			return res.status(400).json({ message: "Email already in use" });

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await authService.createUser({ email, hashedPassword, role });
		const token = createToken(user);
		return res.status(201).json({ user, token });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Registration failed" });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await authService.findUserByEmail(email);
		if (!user) return res.status(400).json({ message: "Invalid credentials" });

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return res.status(400).json({ message: "Invalid credentials" });

		const token = createToken(user);
		return res.status(200).json({ user, token });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Login failed" });
	}
};

module.exports = { register, login };
