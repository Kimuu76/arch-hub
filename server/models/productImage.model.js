/** @format */

const { poolPromise } = require("../config/db");

const initProductImagesTable = async () => {
	const pool = await poolPromise;

	const tableCheckQuery = `
		IF NOT EXISTS (
			SELECT * FROM INFORMATION_SCHEMA.TABLES 
			WHERE TABLE_NAME = 'ProductImages'
		)
		BEGIN
			CREATE TABLE ProductImages (
				id INT IDENTITY(1,1) PRIMARY KEY,
				product_id INT NOT NULL,
				image_path NVARCHAR(255) NOT NULL,
				created_at DATETIME DEFAULT GETDATE(),
				FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
			)
		END
	`;

	await pool.request().query(tableCheckQuery);
	console.log("✅ ProductImages table checked/created");
};

module.exports = { initProductImagesTable };
