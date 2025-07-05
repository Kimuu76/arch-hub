/** @format */

const express = require("express");
const router = express.Router();

// Corrected paths (double-check these paths exist!)
const {
	createOrder,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
} = require("../controllers/order.controller");

const authenticate = require("../middlwares/auth.middleware");
const requireAdmin = require("../middlwares/admin.middleware");

// Routes
router.get("/", authenticate, getAllOrders);
router.post("/checkout", authenticate, createOrder);
router.put("/:id/status", authenticate, requireAdmin, updateOrderStatus);
router.delete("/:id", authenticate, requireAdmin, deleteOrder);

module.exports = router;
