/** @format */

const { poolPromise } = require("../config/db");
const bcrypt = require("bcrypt");

const initUserTable = async () => {
	const pool = await poolPromise;

	const tableExistsQuery = `
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'Users'
    )
    BEGIN
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT GETDATE()
      )
    END
  `;

	await pool.request().query(tableExistsQuery);
	console.log("✅ Users table checked/created");

	// ✅ Insert default admin user if not exists
	const email = "feloh@gmail.com";
	const password = "12345";
	const role = "admin";

	const checkAdminQuery = `
    SELECT * FROM Users WHERE email = @email
  `;

	const result = await pool
		.request()
		.input("email", email)
		.query(checkAdminQuery);

	if (result.recordset.length === 0) {
		const hashedPassword = await bcrypt.hash(password, 12);
		await pool
			.request()
			.input("email", email)
			.input("password", hashedPassword)
			.input("role", role).query(`
        INSERT INTO Users (email, password, role)
        VALUES (@email, @password, @role)
      `);
		console.log("✅ Default admin user created");
	} else {
		console.log("ℹ️ Admin user already exists");
	}
};

module.exports = { initUserTable };

/** @format 

const { poolPromise } = require("../config/db");

const initUserTable = async () => {
	const pool = await poolPromise;

	const tableExistsQuery = `
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'Users'
    )
    BEGIN
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT GETDATE()
      )
    END
  `;

	await pool.request().query(tableExistsQuery);
	console.log("✅ Users table checked/created");
};

module.exports = { initUserTable };*/
