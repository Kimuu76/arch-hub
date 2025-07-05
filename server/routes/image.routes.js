/** @format */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/image.controller");
const upload = require("../middlwares/upload.middleware");
const authenticate = require("../middlwares/auth.middleware");
const requireAdmin = require("../middlwares/admin.middleware");

router.post(
	"/:productId",
	authenticate,
	requireAdmin,
	upload.single("image"),
	controller.uploadImage
);
router.get("/:productId", controller.getProductImages);

module.exports = router;
