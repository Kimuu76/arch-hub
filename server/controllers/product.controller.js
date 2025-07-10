/** @format */

const productService = require("../services/product.service");
const PurchaseService = require("../services/purchase.service");
const path = require("path");

const getAllProducts = async (_, res) => {
	const products = await productService.getAll();
	res.json(products);
};

const getProductById = async (req, res) => {
	console.log("Fetching product ID:", req.params.id);
	const product = await productService.getById(req.params.id);
	if (!product) {
		console.warn("Product not found:", req.params.id);
		return res.sendStatus(404);
	}
	res.json(product);
};

const downloadPlan = async (req, res) => {
	const { id } = req.params;
	const { token } = req.query;

	const purchase = await PurchaseService.getByToken(token);
	if (!purchase || purchase.product_id != id) {
		return res.status(403).json({ error: "Unauthorized or invalid token" });
	}

	const product = await productService.getById(id);
	if (!product.plan_file)
		return res.status(404).json({ error: "No plan available" });

	const fullPath = path.join(__dirname, "..", product.plan_file);
	res.download(fullPath);
};

/*const createProduct = async (req, res) => {
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

		const images = req.files?.images?.[0]?.filename || null;
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
			images,
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
};*/

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

		// 🔥 New: extract multiple additional images (array)
		const galleryImages = req.files?.images || [];
		const imagePaths = galleryImages.map((f) => `/uploads/${f.filename}`);

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
			imagePaths,
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

		const images =
			req.files?.images?.map((f) => `/uploads/${f.filename}`) || [];

		const productData = {
			title,
			description,
			short_description,
			price: price ? parseFloat(price) : null,
			category_id: category_id ? parseInt(category_id) : null,
			bedrooms: bedrooms ? parseInt(bedrooms) : null,
			bathrooms: bathrooms ? parseInt(bathrooms) : null,
			stories: stories ? parseInt(stories) : null,
			images,
			plot_size,
			roof_type,
			style,
		};

		const product = await productService.update(
			req.params.id,
			productData,
			req.files,
			images
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
	downloadPlan,
};
