/** @format */

const { poolPromise } = require("../config/db");

const getAll = async () => {
	const pool = await poolPromise;
	const result = await pool.request().query(`
    SELECT p.*, c.name AS category_name
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);
	return result.recordset;
};

const getById = async (id) => {
	const pool = await poolPromise;
	const result = await pool.request().input("id", id).query(`
			SELECT p.*, c.name AS category_name
			FROM Products p
			LEFT JOIN Categories c ON p.category_id = c.id
			WHERE p.id = @id
		`);
	return result.recordset[0];
};

const create = async (product) => {
	const {
		title,
		description,
		short_description,
		price,
		category_id,
		image,
		plan_file,
		bedrooms,
		bathrooms,
		stories,
		plot_size,
		roof_type,
		style,
	} = product;

	const pool = await poolPromise;

	const result = await pool
		.request()
		.input("title", title)
		.input("description", description)
		.input("short_description", short_description)
		.input("price", price)
		.input("category_id", category_id)
		.input("image", image ? `/uploads/${image}` : null)
		.input("plan_file", plan_file ? `/uploads/${plan_file}` : null)
		.input("bedrooms", bedrooms)
		.input("bathrooms", bathrooms)
		.input("stories", stories)
		.input("plot_size", plot_size)
		.input("roof_type", roof_type)
		.input("style", style).query(`
			INSERT INTO Products (
				title, description, short_description, price, category_id,
				image, plan_file, bedrooms, bathrooms, stories,
				plot_size, roof_type, style
			)
			OUTPUT INSERTED.*
			VALUES (
				@title, @description, @short_description, @price, @category_id,
				@image, @plan_file, @bedrooms, @bathrooms, @stories,
				@plot_size, @roof_type, @style
			)
		`);
	return result.recordset[0];
};

/*const update = async (id, product) => {
	const { title, description, price, category_id } = product;
	const pool = await poolPromise;
	await pool
		.request()
		.input("id", id)
		.input("title", title)
		.input("description", description)
		.input("price", price)
		.input("category_id", category_id).query(`
      UPDATE Products
      SET title = @title,
          description = @description,
          price = @price,
          category_id = @category_id
      WHERE id = @id
    `);
};*/

const update = async (id, data, files = {}) => {
	const pool = await poolPromise;

	let setClauses = `
	title = @title,
	price = @price,
	description = @description,
	short_description = @short_description,
	category_id = @category_id,
	bedrooms = @bedrooms,
	bathrooms = @bathrooms,
	stories = @stories,
	plot_size = @plot_size,
	roof_type = @roof_type,
	style = @style
`;

	const request = pool
		.request()
		.input("id", id)
		.input("title", data.title)
		.input("price", data.price)
		.input("description", data.description)
		.input("short_description", data.short_description)
		.input("category_id", data.category_id)
		.input("bedrooms", data.bedrooms)
		.input("bathrooms", data.bathrooms)
		.input("stories", data.stories)
		.input("plot_size", data.plot_size)
		.input("roof_type", data.roof_type)
		.input("style", data.style);

	if (files.image && files.image[0]) {
		setClauses += `, image = @image`;
		request.input("image", `/uploads/${files.image[0].filename}`);
	}

	if (files.plan_file && files.plan_file[0]) {
		setClauses += `, plan_file = @plan_file`;
		request.input("plan_file", `/uploads/${files.plan_file[0].filename}`);
	}

	const query = `
		UPDATE Products SET
		${setClauses}
		WHERE id = @id;

		SELECT * FROM Products WHERE id = @id;
	`;

	const result = await request.query(query);
	return result.recordset[0];
};

const toggleStatus = async (id) => {
	const pool = await poolPromise;

	const getStatus = await pool
		.request()
		.input("id", id)
		.query("SELECT status FROM Products WHERE id = @id");

	if (getStatus.recordset.length === 0) return null;

	const currentStatus = getStatus.recordset[0].status;
	const newStatus = currentStatus === "active" ? "inactive" : "active";

	await pool
		.request()
		.input("id", id)
		.input("status", newStatus)
		.query("UPDATE Products SET status = @status WHERE id = @id");

	const result = await pool
		.request()
		.input("id", id)
		.query("SELECT * FROM Products WHERE id = @id");

	return result.recordset[0];
};

const remove = async (id) => {
	const pool = await poolPromise;
	await pool
		.request()
		.input("id", id)
		.query("DELETE FROM Products WHERE id = @id");
};

module.exports = { getAll, getById, create, update, remove, toggleStatus };
