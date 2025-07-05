/** @format */

const productService = require("../services/product.service");

const getAllProducts = async (_, res) => {
	const products = await productService.getAll();
	res.json(products);
};

const getProductById = async (req, res) => {
	const product = await productService.getById(req.params.id);
	if (!product) return res.sendStatus(404);
	res.json(product);
};

const createProduct = async (req, res) => {
	try {
		const {
			title,
			description,
			short_description,
			price,
			category_id,
			bedrooms,
			bathrooms,
			stories,
			plot_size,
			roof_type,
			style,
		} = req.body;

		const image = req.files?.image?.[0]?.filename || null;
		const plan_file = req.files?.plan_file?.[0]?.filename || null;

		// Safety check
		if (!title || !price || !description || !category_id) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const productData = {
			title,
			description,
			short_description,
			price: parseFloat(price),
			category_id: parseInt(category_id),
			image,
			plan_file,
			bedrooms: bedrooms ? parseInt(bedrooms) : null,
			bathrooms: bathrooms ? parseInt(bathrooms) : null,
			stories: stories ? parseInt(stories) : null,
			plot_size,
			roof_type,
			style,
		};

		const product = await productService.create(productData);

		res.status(201).json(product);
	} catch (err) {
		console.error("Create Product Error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

const updateProduct = async (req, res) => {
	try {
		const {
			title,
			description,
			short_description,
			price,
			category_id,
			bedrooms,
			bathrooms,
			stories,
			plot_size,
			roof_type,
			style,
		} = req.body;

		const productData = {
			title,
			description,
			short_description,
			price: price ? parseFloat(price) : null,
			category_id: category_id ? parseInt(category_id) : null,
			bedrooms: bedrooms ? parseInt(bedrooms) : null,
			bathrooms: bathrooms ? parseInt(bathrooms) : null,
			stories: stories ? parseInt(stories) : null,
			plot_size,
			roof_type,
			style,
		};

		const product = await productService.update(
			req.params.id,
			productData,
			req.files
		);

		res.status(200).json(product);
	} catch (err) {
		console.error("Update Product Error:", err);
		res.status(500).json({ message: "Failed to update product" });
	}
};

const toggleProductStatus = async (req, res) => {
	try {
		const updated = await productService.toggleStatus(req.params.id);
		if (!updated) return res.status(404).json({ message: "Product not found" });
		res.status(200).json(updated);
	} catch (err) {
		console.error("Toggle Status Error:", err);
		res.status(500).json({ message: "Failed to toggle status" });
	}
};

const deleteProduct = async (req, res) => {
	await productService.remove(req.params.id);
	res.sendStatus(204);
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	toggleProductStatus,
};
