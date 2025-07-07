/** @format */

const { poolPromise } = require("../config/db");
const crypto = require("crypto");

exports.create = async ({ product_id, phone, amount, external_id }) => {
	try {
		const token = crypto.randomBytes(16).toString("hex");
		const pool = await poolPromise;

		const { recordset } = await pool
			.request()
			.input("product_id", product_id)
			.input("phone", phone)
			.input("amount", amount)
			.input("external_id", external_id)
			.input("download_token", token).query(`
        INSERT INTO Purchases (
          product_id,
          phone,
          amount,
          external_id,
          download_token
        )
        OUTPUT INSERTED.*
        VALUES (
          @product_id,
          @phone,
          @amount,
          @external_id,
          @download_token
        )
      `);

		console.log("✅ Purchase created with token:", token);
		return recordset[0];
	} catch (err) {
		console.error("❌ Error creating purchase:", err.message);
		throw err;
	}
};

// Optional: for validating download access
exports.validateToken = async ({ product_id, token }) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("product_id", product_id)
		.input("download_token", token).query(`
			SELECT * FROM Purchases
			WHERE product_id = @product_id AND download_token = @download_token
		`);
	return result.recordset.length > 0;
};
