/** @format */

const imageService = require("../services/image.service");

const uploadImage = async (req, res) => {
	const product_id = req.params.productId;
	if (!req.file) return res.status(400).json({ error: "No file uploaded" });

	const saved = await imageService.saveImage(
		product_id,
		`/uploads/${req.file.filename}`
	);
	res.status(201).json(saved);
};

const getProductImages = async (req, res) => {
	const images = await imageService.getImagesByProduct(req.params.productId);
	res.json(images);
};

module.exports = { uploadImage, getProductImages };
