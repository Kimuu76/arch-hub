/** @format */

const { poolPromise } = require("../config/db");

const initProductImageTable = async () => {
	const pool = await poolPromise;

	const query = `
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ProductImages'
    )
    BEGIN
      CREATE TABLE ProductImages (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL,
        image_url NVARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
      )
    END
  `;
	await pool.request().query(query);
	console.log("✅ ProductImages table checked/created");
};

module.exports = { initProductImageTable };
