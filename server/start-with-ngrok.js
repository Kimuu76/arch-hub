/** @format */

// start-with-ngrok.js
const ngrok = require("ngrok");
const fs = require("fs");
require("dotenv").config();

(async function () {
	try {
		const port = process.env.PORT || 5000;
		await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
		const url = await ngrok.connect(port);

		console.log(`🔗 Ngrok tunnel established at: ${url}`);

		// Update .env file
		const envPath = ".env";
		let envContent = fs.readFileSync(envPath, "utf8");

		if (envContent.includes("BASE_URL=")) {
			envContent = envContent.replace(/BASE_URL=.*/g, `BASE_URL=${url}`);
		} else {
			envContent += `\nBASE_URL=${url}`;
		}

		fs.writeFileSync(envPath, envContent);
		console.log("✅ .env updated with Ngrok URL");

		// Start your actual server
		const { exec } = require("child_process");
		exec("node server.js", (err, stdout, stderr) => {
			if (err) {
				console.error(`❌ Error starting server: ${err.message}`);
				return;
			}
			console.log(stdout);
			if (stderr) console.error(stderr);
		});
	} catch (err) {
		console.error("Ngrok failed:", err);
	}
})();
