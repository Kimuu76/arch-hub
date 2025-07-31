/** @format */

const productService = require("../services/product.service");
const PurchaseService = require("../services/purchase.service");
const path = require("path");
const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const sharp = require("sharp");
const { degrees } = require("pdf-lib");

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
	if (!product.plan_file) {
		return res.status(404).json({ error: "No plan available" });
	}

	const filePath = path.join(__dirname, "..", product.plan_file);
	const fileExt = path.extname(filePath).toLowerCase();

	try {
		if (fileExt === ".pdf") {
			// Watermark PDF
			const pdfBytes = fs.readFileSync(filePath);
			const pdfDoc = await PDFDocument.load(pdfBytes);
			const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

			const pages = pdfDoc.getPages();
			pages.forEach((page) => {
				const { width, height } = page.getSize();

				page.drawText("amfhomedesigns.com", {
					x: width / 2 - 200,
					y: height / 2,
					size: 50,
					font,
					color: rgb(0.85, 0.85, 0.85),
					opacity: 0.25,
					rotate: degrees(-45),
				});
			});

			const modifiedPdf = await pdfDoc.save();
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=plan_${id}.pdf`
			);
			return res.send(modifiedPdf);
		} else if ([".jpg", ".jpeg", ".png"].includes(fileExt)) {
			// Watermark image
			const image = sharp(filePath);
			const { width, height } = await image.metadata();

			const watermarkText = Buffer.from(
				`<svg width="${width}" height="100">
					<text x="50%" y="50%" font-size="24" fill="gray" opacity="0.5" text-anchor="middle" alignment-baseline="middle">
						amfhomedesigns.com
					</text>
				</svg>`
			);

			const watermarkedImage = await image
				.composite([{ input: watermarkText, top: height - 100, left: 0 }])
				.toBuffer();

			res.setHeader("Content-Type", "image/" + fileExt.replace(".", ""));
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=plan_${id}${fileExt}`
			);
			return res.send(watermarkedImage);
		} else {
			// Other file types (fallback)
			return res.download(filePath);
		}
	} catch (err) {
		console.error("Watermarking/Download Error:", err);
		return res
			.status(500)
			.json({ error: "Failed to process file for download" });
	}
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
