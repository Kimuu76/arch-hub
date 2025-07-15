/** @format */

const { poolPromise } = require("../config/db");

exports.getAllPurchases = async (req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT TOP 100 * FROM Purchases ORDER BY created_at DESC
		`);
		res.json(result.recordset);
	} catch (err) {
		console.error("❌ Admin fetch error:", err.message);
		res.status(500).json({ error: "Failed to fetch purchases" });
	}
};

exports.getAdminStats = async (req, res) => {
	try {
		const pool = await poolPromise;

		// Date filters
		const from = req.query.from || "2000-01-01";
		const to = req.query.to || "2100-12-31";

		// Main stats
		const [products, categories, purchases, revenue] = await Promise.all([
			pool.request().query("SELECT COUNT(*) as total FROM Products"),
			pool.request().query("SELECT COUNT(*) as total FROM Categories"),
			pool
				.request()
				.input("from", from)
				.input("to", to)
				.query(
					`SELECT COUNT(*) as total FROM Purchases 
           WHERE created_at BETWEEN @from AND @to`
				),
			pool
				.request()
				.input("from", from)
				.input("to", to)
				.query(
					`SELECT SUM(amount) as total FROM Purchases 
           WHERE created_at BETWEEN @from AND @to`
				),
		]);

		// Daily revenue
		const dailyRevenueResult = await pool
			.request()
			.input("from", from)
			.input("to", to).query(`
        SELECT 
          CONVERT(VARCHAR(10), created_at, 120) AS date,
          SUM(amount) AS amount
        FROM Purchases
        WHERE created_at BETWEEN @from AND @to
        GROUP BY CONVERT(VARCHAR(10), created_at, 120)
        ORDER BY date ASC
      `);

		// Top-selling products (by frequency)
		const topProductsResult = await pool
			.request()
			.input("from", from)
			.input("to", to).query(`
        SELECT 
          P.title, COUNT(*) as count
        FROM Purchases PU
        JOIN Products P ON PU.product_id = P.id
        WHERE PU.created_at BETWEEN @from AND @to
        GROUP BY P.title
        ORDER BY count DESC
        OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
      `);

		res.json({
			products: products.recordset[0].total,
			categories: categories.recordset[0].total,
			purchases: purchases.recordset[0].total,
			revenue: revenue.recordset[0].total || 0,
			dailyRevenue: dailyRevenueResult.recordset,
			topProducts: topProductsResult.recordset,
		});
	} catch (err) {
		console.error("❌ Admin stats error:", err.message);
		res.status(500).json({ error: "Failed to load dashboard stats" });
	}
};

exports.approvePurchase = async (req, res) => {
	try {
		const pool = await poolPromise;
		await pool
			.request()
			.input("id", req.params.id)
			.query("UPDATE Purchases SET status='approved' WHERE id=@id");

		res.status(200).json({ message: "Purchase approved" });
	} catch (err) {
		console.error("Approval error:", err);
		res.status(500).json({ error: "Failed to approve purchase" });
	}
};
