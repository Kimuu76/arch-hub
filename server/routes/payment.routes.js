/** @format */

const express = require("express");
const router = express.Router();
const {
	initiateStkPush,
	handleStkCallback,
} = require("../controllers/payments.controller");

router.post("/stk-push", initiateStkPush);
router.post("/callback/stk", handleStkCallback);

module.exports = router;
