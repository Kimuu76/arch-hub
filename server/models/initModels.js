/** @format */

const { initUserTable } = require("./user.model");
const { initCategoryTable } = require("./category.model");
const { initProductTable } = require("./product.model");
const { initProductImagesTable } = require("./productImage.model");
const { initOrderTable } = require("./order.model");
const { initPurchaseTable } = require("./purchase.model");

const initializeModels = async () => {
	try {
		await initUserTable();
		await initCategoryTable();
		await initProductTable();
		await initProductImagesTable();
		await initOrderTable();
		await initPurchaseTable();
		console.log("✅ All models initialized");
	} catch (err) {
		console.error("❌ Error initializing models:", err);
		process.exit(1);
	}
};

module.exports = { initializeModels };
