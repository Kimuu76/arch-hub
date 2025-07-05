/** @format */

const { poolPromise } = require("../config/db");

const findUserByEmail = async (email) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("email", email)
		.query("SELECT TOP 1 * FROM Users WHERE email = @email");
	return result.recordset[0];
};

const createUser = async (user) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("email", user.email)
		.input("password", user.hashedPassword)
		.input("role", user.role).query(`
      INSERT INTO Users (email, password, role)
      OUTPUT INSERTED.*
      VALUES (@email, @password, @role)
    `);
	return result.recordset[0];
};

module.exports = { findUserByEmail, createUser };
