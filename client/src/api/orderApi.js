/** @format */

import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const placeOrder = async (orderData) => {
	try {
		const res = await axios.post(`${API_URL}/orders`, orderData);
		return res.data;
	} catch (err) {
		console.error("Order Error:", err);
		return { success: false };
	}
};
