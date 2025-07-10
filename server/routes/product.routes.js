/** @format */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");
const authenticate = require("../middlwares/auth.middleware");
const requireAdmin = require("../middlwares/admin.middleware");
const upload = require("../middlwares/upload.middleware");

router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);
router.post(
	"/",
	authenticate,
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "plan_file", maxCount: 1 },
		{ name: "images", maxCount: 10 },
	]),
	controller.createProduct
);
router.patch(
	"/:id/toggle-status",
	authenticate,
	controller.toggleProductStatus
);

//router.post("/", authenticate, controller.createProduct);
router.put(
	"/:id",
	authenticate,
	upload.fields([{ name: "image" }, { name: "plan_file" }]),
	controller.updateProduct
);
router.delete("/:id", authenticate, controller.deleteProduct);

router.get("/:id/download", controller.downloadPlan);

module.exports = router;
