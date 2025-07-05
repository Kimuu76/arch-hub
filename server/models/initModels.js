/** @format */

const { initUserTable } = require("./user.model");
const { initCategoryTable } = require("./category.model");
const { initProductTable } = require("./product.model");
const { initProductImageTable } = require("./productImage.model");
const { initOrderTable } = require("./order.model");

const initializeModels = async () => {
	try {
		await initUserTable();
		await initCategoryTable();
		await initProductTable();
		await initProductImageTable();
		await initOrderTable();
		console.log("✅ All models initialized");
	} catch (err) {
		console.error("❌ Error initializing models:", err);
		process.exit(1);
	}
};

module.exports = { initializeModels };
