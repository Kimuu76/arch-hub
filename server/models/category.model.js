/** @format */

const { poolPromise } = require("../config/db");

const initCategoryTable = async () => {
	const pool = await poolPromise;

	const query = `
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categories'
    )
    BEGIN
      CREATE TABLE Categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT GETDATE()
      )
    END
  `;
	await pool.request().query(query);
	console.log("✅ Categories table checked/created");
};

module.exports = { initCategoryTable };
