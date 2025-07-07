/** @format */

const PurchaseService = require("../services/purchase.service");

exports.createPurchase = async (req, res) => {
	try {
		const { product_id, phone, amount, external_id } = req.body;

		if (!product_id || !phone || !amount) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const purchase = await PurchaseService.create({
			product_id,
			phone,
			amount,
			external_id: external_id || null,
		});

		res.status(201).json({ success: true, token: purchase.download_token });
	} catch (err) {
		console.error("Create Purchase Error:", err);
		res.status(500).json({ error: "Failed to create purchase" });
	}
};

exports.validateToken = async (req, res) => {
	try {
		const { product_id, token } = req.query;

		if (!product_id || !token) {
			return res.status(400).json({ error: "Missing token or product_id" });
		}

		const isValid = await PurchaseService.validateToken({ product_id, token });

		res.status(200).json({ valid: isValid });
	} catch (err) {
		console.error("Validate Token Error:", err);
		res.status(500).json({ error: "Failed to validate token" });
	}
};

/** @format 

const { poolPromise } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createPurchase = async (req, res) => {
	const { product_id } = req.body;

	if (!product_id)
		return res.status(400).json({ error: "Product ID required" });

	const token = uuidv4();
	const pool = await poolPromise;

	await pool
		.request()
		.input("product_id", product_id)
		.input("purchase_token", token).query(`
      INSERT INTO Purchases (product_id, purchase_token)
      VALUES (@product_id, @purchase_token)
    `);

	res.status(201).json({ token });
};

const validateToken = async (req, res) => {
	const { token, product_id } = req.query;
	if (!token || !product_id)
		return res.status(400).json({ error: "Missing token or product ID" });

	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("token", token)
		.input("product_id", product_id).query(`
      SELECT * FROM Purchases
      WHERE download_token = @token AND product_id = @product_id
    `);

	if (result.recordset.length > 0) {
		res.status(200).json({ valid: true });
	} else {
		res.status(403).json({ valid: false });
	}
};

module.exports = { createPurchase, validateToken };*/
