/** @format */

import axios from "./axios";

export const getAllProducts = async () => {
	const res = await axios.get("/products");
	return res.data;
};

export const getProductById = async (id) => {
	const res = await axios.get(`/products/${id}`);
	return res.data;
};

export const getProductImages = async (productId) => {
	const res = await axios.get(`/images/${productId}`);
	return res.data;
};

export const getAllCategories = async () => {
	const res = await axios.get("/categories");
	return res.data;
};
