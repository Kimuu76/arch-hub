/** @format */

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const CheckoutSuccessPage = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const storeToken = async () => {
			const productId = params.get("product_id");
			if (!productId) return;

			try {
				const res = await axios.post("/purchases", { product_id: productId });
				const { token } = res.data;

				localStorage.setItem(`purchase_${productId}`, token);
				navigate(`/product/${productId}`);
			} catch (err) {
				console.error("Failed to store purchase token", err);
			}
		};

		storeToken();
	}, []);

	return <p>Processing your purchase...</p>;
};

export default CheckoutSuccessPage;
