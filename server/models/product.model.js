/** @format */

const { poolPromise } = require("../config/db");

const initProductTable = async () => {
	const pool = await poolPromise;

	// Check if table exists
	const checkProducts = await pool
		.request()
		.query(
			`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Products'`
		);

	if (checkProducts.recordset.length === 0) {
		await pool.request().query(`
			CREATE TABLE Products (
			  id INT IDENTITY(1,1) PRIMARY KEY,
			  title NVARCHAR(255) NOT NULL,
			  description NVARCHAR(MAX),
			  short_description NVARCHAR(MAX),
			  price DECIMAL(18,2) NOT NULL,
			  category_id INT,
			  image NVARCHAR(255),
			  plan_file NVARCHAR(255),
			  bedrooms INT,
			  bathrooms INT,
			  stories INT,
			  plot_size NVARCHAR(50),
			  roof_type NVARCHAR(100),
			  style NVARCHAR(100),
			  status NVARCHAR(20) DEFAULT 'active',
			  created_at DATETIME DEFAULT GETDATE()
			)
		`);

		console.log("✅ Products table created");
	} else {
		console.log("ℹ️ Products table already exists");

		// Check if 'status' column exists, add if missing
		const checkStatusColumn = await pool.request().query(`
			SELECT * 
			FROM INFORMATION_SCHEMA.COLUMNS 
			WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'status'
		`);

		if (checkStatusColumn.recordset.length === 0) {
			await pool.request().query(`
				ALTER TABLE Products ADD status NVARCHAR(20) DEFAULT 'active'
			`);
			console.log("✅ 'status' column added to Products table");
		}
	}
};

module.exports = { initProductTable };
