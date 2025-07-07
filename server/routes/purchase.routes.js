/** @format */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchase.controller");

router.post("/", controller.createPurchase);
router.get("/validate", controller.validateToken);

module.exports = router;
