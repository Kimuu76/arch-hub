/** @format 

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadPath),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${file.originalname.replace(
			/\s+/g,
			"_"
		)}`;
		cb(null, uniqueName);
	},
});

const fileFilter = (req, file, cb) => {
	const allowed = ["image/jpeg", "image/png", "image/webp"];
	if (allowed.includes(file.mimetype)) cb(null, true);
	else cb(new Error("Only JPG, PNG, WEBP allowed"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;*/

// /middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

module.exports = upload;
