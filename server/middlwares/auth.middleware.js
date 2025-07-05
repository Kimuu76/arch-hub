/** @format */

const jwt = require("jsonwebtoken");
const { poolPromise } = require("../config/db");

module.exports = async function authenticate(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")[1];

	if (!token) return res.sendStatus(401);

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const pool = await poolPromise;

		const userQuery = await pool
			.request()
			.input("id", decoded.id)
			.query("SELECT id, email, role FROM Users WHERE id = @id");

		if (!userQuery.recordset.length) return res.sendStatus(403);

		req.user = userQuery.recordset[0]; // includes `role`
		next();
	} catch {
		res.sendStatus(403);
	}
};

/** @format 

const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer "))
		return res.status(401).json({ message: "Unauthorized" });

	const token = authHeader.split(" ")[1];
	try {
		const user = verifyToken(token);
		req.user = user;
		next();
	} catch (err) {
		return res.status(403).json({ message: "Invalid token" });
	}
};

module.exports = authenticate;*/
