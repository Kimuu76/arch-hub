/** @format */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const authenticate = require("../middlwares/auth.middleware");
const requireAdmin = require("../middlwares/admin.middleware");

router.get("/", controller.getAllCategories);
router.post("/", authenticate, controller.createCategory);
router.put("/:id", authenticate, controller.updateCategory);
router.delete("/:id", authenticate, controller.deleteCategory);

module.exports = router;
