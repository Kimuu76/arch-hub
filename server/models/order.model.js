/** @format */
const { poolPromise } = require("../config/db");

const initOrderTable = async () => {
	const pool = await poolPromise;

	// Drop and recreate Orders table (ONLY IN DEVELOPMENT)
	await pool.request().query(`
    IF OBJECT_ID('OrderItems', 'U') IS NOT NULL DROP TABLE OrderItems;
    IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
  `);

	await pool.request().query(`
    CREATE TABLE Orders (
      id INT IDENTITY(1,1) PRIMARY KEY,
      user_id INT NULL,
      customer_name NVARCHAR(100),
      customer_email NVARCHAR(100),
      shipping_address NVARCHAR(255),
      customer_phone NVARCHAR(100),
      total_amount DECIMAL(18,2) NOT NULL,
      status NVARCHAR(50) DEFAULT 'pending',
      created_at DATETIME DEFAULT GETDATE()
    )
  `);

	await pool.request().query(`
    CREATE TABLE OrderItems (
      id INT IDENTITY(1,1) PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(18,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES Orders(id)
    )
  `);

	console.log("✅ Orders and OrderItems tables created");
};

module.exports = { initOrderTable };
