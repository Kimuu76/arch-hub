/** @format */

const categoryService = require("../services/category.service");

const getAllCategories = async (_, res) => {
	const categories = await categoryService.getAll();
	res.json(categories);
};

const createCategory = async (req, res) => {
	const { name } = req.body;
	const category = await categoryService.create(name);
	res.status(201).json(category);
};

const updateCategory = async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	await categoryService.update(id, name);
	res.sendStatus(204);
};

const deleteCategory = async (req, res) => {
	await categoryService.remove(req.params.id);
	res.sendStatus(204);
};

module.exports = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
