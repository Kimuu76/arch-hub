/** @format */

const express = require("express");
const router = express.Router();
const {
	getAllPurchases,
	getAdminStats,
} = require("../controllers/admin.controller");

router.get("/purchases", getAllPurchases);
router.get("/stats", getAdminStats);

module.exports = router;
