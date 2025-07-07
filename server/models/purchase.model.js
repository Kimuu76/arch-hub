/** @format */
/** @format */

const { poolPromise } = require("../config/db");

const initPurchaseTable = async () => {
	const pool = await poolPromise;
	await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Purchases'
    )
    BEGIN
      CREATE TABLE Purchases (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        amount DECIMAL(18,2) NOT NULL,
        external_id NVARCHAR(100) NULL,
        download_token NVARCHAR(100) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
      )
    END
  `);
	console.log("✅ Purchases table checked/created");
};

module.exports = { initPurchaseTable };
