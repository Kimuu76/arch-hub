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
        status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT GETDATE()
      )
    END
    ELSE
    BEGIN
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'Purchases' AND COLUMN_NAME = 'status'
      )
      BEGIN
        ALTER TABLE Purchases
        ADD status NVARCHAR(20) NOT NULL DEFAULT 'pending'
      END
    END
  `);
	console.log("✅ Purchases table checked/created with status column");
};

module.exports = { initPurchaseTable };
