/** @format */

const { poolPromise } = require("../config/db");
const sql = require("mssql");
const axios = require("axios");

async function placeOrder(data) {
	const {
		user_id,
		customer_name,
		customer_email,
		shipping_address,
		customer_phone,
		total_amount,
		items,
	} = data;

	const pool = await poolPromise;

	// ✅ FIXED: Capture result in orderResult
	const orderResult = await pool
		.request()
		.input("customer_name", sql.NVarChar, customer_name)
		.input("customer_email", sql.NVarChar, customer_email)
		.input("shipping_address", sql.NVarChar, shipping_address)
		.input("customer_phone", sql.NVarChar, customer_phone)
		.input("total_amount", sql.Decimal(10, 2), total_amount)
		.query(
			`INSERT INTO orders (customer_name, customer_email, shipping_address, customer_phone, total_amount)
       OUTPUT INSERTED.id
       VALUES (@customer_name, @customer_email, @shipping_address, @customer_phone, @total_amount)`
		);

	const orderId = orderResult.recordset[0].id;

	// 1. Insert order
	await pool
		.request()
		.input("customer_name", sql.NVarChar, customer_name)
		.input("customer_email", sql.NVarChar, customer_email)
		.input("shipping_address", sql.NVarChar, shipping_address)
		.input("customer_phone", sql.NVarChar, customer_phone)
		.input("total_amount", sql.Decimal(10, 2), total_amount)
		.query(
			`INSERT INTO orders (customer_name, customer_email, shipping_address, customer_phone, total_amount)
     OUTPUT INSERTED.id
     VALUES (@customer_name, @customer_email, @shipping_address, @customer_phone, @total_amount)`
		);

	// 2. Insert order items
	for (const item of items) {
		await pool
			.request()
			.input("order_id", orderId)
			.input("product_id", item.product_id)
			.input("quantity", item.quantity)
			.input("price", item.price).query(`
        INSERT INTO OrderItems (order_id, product_id, quantity, price)
        VALUES (@order_id, @product_id, @quantity, @price)
      `);
	}

	return { id: orderId };
}

// === M-PESA STK Push ===
const {
	generateTimestamp,
	generatePassword,
	getDarajaToken,
} = require("../utilis/mpesa.utils");

async function initiatePayment(orderId, amount, phone) {
	const token = await getDarajaToken();

	const response = await axios.post(
		"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
		{
			BusinessShortCode: process.env.MPESA_SHORTCODE,
			Password: generatePassword(),
			Timestamp: generateTimestamp(),
			TransactionType: "CustomerPayBillOnline",
			Amount: amount,
			PartyA: phone,
			PartyB: process.env.MPESA_SHORTCODE,
			PhoneNumber: phone,
			CallBackURL: `${process.env.BASE_URL}/api/orders/callback`,
			AccountReference: `ORDER${orderId}`,
			TransactionDesc: `Payment for Order ${orderId}`,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return {
		CheckoutRequestID: response.data.CheckoutRequestID,
		MerchantRequestID: response.data.MerchantRequestID,
		ResponseDescription: response.data.ResponseDescription,
		CustomerMessage: response.data.CustomerMessage,
	};
}

module.exports = {
	placeOrder,
	initiatePayment,
};
