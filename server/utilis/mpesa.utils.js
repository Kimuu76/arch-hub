/** @format */

const axios = require("axios");
const moment = require("moment");

const generateTimestamp = () => {
	return moment().format("YYYYMMDDHHmmss");
};

const generatePassword = () => {
	const timestamp = generateTimestamp();
	const shortcode = process.env.MPESA_SHORTCODE;
	const passkey = process.env.MPESA_PASSKEY;
	const data = `${shortcode}${passkey}${timestamp}`;
	return Buffer.from(data).toString("base64");
};

const getDarajaToken = async () => {
	const consumerKey = process.env.MPESA_CONSUMER_KEY;
	const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
	const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
		"base64"
	);

	const response = await axios.get(
		"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
		{
			headers: {
				Authorization: `Basic ${auth}`,
			},
		}
	);

	return response.data.access_token;
};

module.exports = {
	generateTimestamp,
	generatePassword,
	getDarajaToken,
};
