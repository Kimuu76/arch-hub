/** @format 

const { placeOrder, initiatePayment } = require("../services/order.service");

async function createOrder(req, res) {
	try {
		const {
			customer_name,
			customer_email,
			shipping_address,
			items,
			total_amount,
			customer_phone, // <- make sure it's passed from frontend
		} = req.body;

		const order = await placeOrder({
			customer_name,
			customer_email,
			shipping_address,
			items,
			total_amount,
		});

		const payment = await initiatePayment(
			order.id,
			total_amount,
			customer_phone
		);

		res.json({ order, payment_url: payment.checkoutUrl });
	} catch (error) {
		console.error("Order creation failed:", error);
		res.status(500).json({ error: "Failed to create order" });
	}
}

// Export the controller functions
module.exports = {
	createOrder,
	// define and export others like getAllOrders, updateOrderStatus if used
};*/

/** @format */

const { placeOrder, initiatePayment } = require("../services/order.service");

const getAllOrders = async (_, res) => {
	const orders = await orderService.getAll();
	res.json(orders);
};

async function createOrder(req, res) {
	try {
		const {
			customer_name,
			customer_email,
			shipping_address,
			items,
			total_amount,
			customer_phone,
		} = req.body;

		const user_id = req.user?.id || 1; // fallback if not using auth yet

		const order = await placeOrder({
			user_id,
			customer_name,
			customer_email,
			shipping_address,
			items,
			total_amount,
		});

		const payment = await initiatePayment(
			order.id,
			total_amount,
			customer_phone
		);

		res.status(200).json({
			success: true,
			order_id: order.id,
			message: payment.CustomerMessage,
			payment,
		});
	} catch (err) {
		console.error("Order creation failed", err);
		res.status(500).json({ error: "Order creation failed" });
	}
}

const updateOrderStatus = async (req, res) => {
	await orderService.updateStatus(req.params.id, req.body.status);
	res.sendStatus(204);
};

const deleteOrder = async (req, res) => {
	await orderService.remove(req.params.id);
	res.sendStatus(204);
};

module.exports = {
	getAllOrders,
	createOrder,
	updateOrderStatus,
	deleteOrder,
};
