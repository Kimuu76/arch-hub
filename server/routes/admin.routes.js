/** @format */

const express = require("express");
const router = express.Router();
const {
	getAllPurchases,
	getAdminStats,
	approvePurchase,
} = require("../controllers/admin.controller");

router.get("/purchases", getAllPurchases);
router.get("/stats", getAdminStats);
router.put("/purchases/:id/approve", approvePurchase);

module.exports = router;
