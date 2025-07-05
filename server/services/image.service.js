/** @format */

const { poolPromise } = require("../config/db");

const saveImage = async (product_id, image_url) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("product_id", product_id)
		.input("image_url", image_url).query(`
      INSERT INTO ProductImages (product_id, image_url)
      OUTPUT INSERTED.*
      VALUES (@product_id, @image_url)
    `);
	return result.recordset[0];
};

const getImagesByProduct = async (product_id) => {
	const pool = await poolPromise;
	const result = await pool
		.request()
		.input("product_id", product_id)
		.query("SELECT * FROM ProductImages WHERE product_id = @product_id");
	return result.recordset;
};

module.exports = { saveImage, getImagesByProduct };
