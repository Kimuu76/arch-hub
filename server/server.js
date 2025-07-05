/** @format */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { initializeModels } = require("./models/initModels");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/uploads", express.static("uploads")); // serve images
app.use("/api/images", require("./routes/image.routes"));

app.get("/", (_, res) => res.send("API running ✔"));

// ===== Serve frontend =====
const frontendPath = path.join(__dirname, "client/build");
app.use(express.static(frontendPath));

// Catch-all: serve index.html for React routes like /login
app.get("*", (_, res) => {
	res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	await initializeModels(); // 🔥 Auto-create tables here
	app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
