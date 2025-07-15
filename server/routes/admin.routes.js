/** @format */

const express = require("express");
const router = express.Router();
const {
	getAllPurchases,
	getAdminStats,
	approvePurchase,
	rejectPurchase,
} = require("../controllers/admin.controller");

router.get("/purchases", getAllPurchases);
router.get("/stats", getAdminStats);
router.put("/purchases/:id/approve", approvePurchase);
router.put("/purchases/:id/reject", rejectPurchase);

module.exports = router;
