/** @format */

const { poolPromise } = require("../config/db");

const getAll = async () => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.query("SELECT * FROM Categories ORDER BY name");
	return result.recordset;
};

const create = async (name) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("name", name)
		.query("INSERT INTO Categories (name) OUTPUT INSERTED.* VALUES (@name)");
	return result.recordset[0];
};

const update = async (id, name) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("id", id)
		.input("name", name)
		.query("UPDATE Categories SET name = @name WHERE id = @id");
	return result.rowsAffected[0];
};

const remove = async (id) => {
	const pool = await poolPromise;
	await pool
		.request()
		.input("id", id)
		.query("DELETE FROM Categories WHERE id = @id");
};

module.exports = { getAll, create, update, remove };
