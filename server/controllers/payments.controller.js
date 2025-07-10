/** @format */

const axios = require("axios");
const PurchaseService = require("../services/purchase.service");

const darajaConfig = {
	consumerKey: process.env.MPESA_KEY,
	consumerSecret: process.env.MPESA_SECRET,
	shortCode: process.env.MPESA_PAYBILL,
	passkey: process.env.MPESA_PASSKEY,
	callbackUrl: `${process.env.BASE_URL}/payments/callback/stk`,
};

async function getAccessToken() {
	try {
		const url =
			"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; // ✅ sandbox

		const response = await axios.get(url, {
			auth: {
				username: darajaConfig.consumerKey,
				password: darajaConfig.consumerSecret,
			},
		});

		console.log("✅ Access token retrieved");
		return response.data.access_token;
	} catch (err) {
		console.error(
			"❌ Error fetching access token:",
			err.response?.data || err.message
		);
		throw new Error("Failed to get access token");
	}
}

exports.initiateStkPush = async (req, res) => {
	try {
		const { phone, amount, product_id } = req.body;
		const token = await getAccessToken();
		console.log("✅ DARAJA TOKEN:", token);

		const timestamp = new Date()
			.toISOString()
			.replace(/[^0-9]/g, "")
			.slice(0, 14);
		const password = Buffer.from(
			darajaConfig.shortCode + darajaConfig.passkey + timestamp
		).toString("base64");

		const stkReq = {
			BusinessShortCode: darajaConfig.shortCode,
			Password: password,
			Timestamp: timestamp,
			TransactionType: "CustomerPayBillOnline",
			Amount: amount,
			PartyA: phone,
			PartyB: darajaConfig.shortCode,
			PhoneNumber: phone,
			CallBackURL: darajaConfig.callbackUrl,
			AccountReference: `prod-${product_id}`,
			TransactionDesc: `Payment for product ${product_id}`,
		};

		const { data } = await axios.post(
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", // ✅ sandbox
			stkReq,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		console.log("✅ STK Push request sent:", data);
		res.json({ checkoutRequestID: data.CheckoutRequestID });
	} catch (err) {
		console.error("❌ STK Push Error:", err.response?.data || err.message);
		res.status(500).json({
			error: "STK Push failed",
			details: err.response?.data || err.message,
		});
	}
};

exports.handleStkCallback = async (req, res) => {
	try {
		const callback = req.body.Body.stkCallback;
		const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;

		if (ResultCode === 0) {
			const meta = {};
			CallbackMetadata.Item.forEach((i) => {
				meta[i.Name] = i.Value;
			});

			const phone = meta.PhoneNumber;
			const amount = meta.Amount;

			const accountRefItem = CallbackMetadata.Item.find(
				(i) => i.Name === "AccountReference"
			);
			const accountRef = accountRefItem?.Value || "";
			const productId = accountRef.replace("prod-", "");

			const purchase = await PurchaseService.create({
				product_id: productId,
				phone,
				amount,
				external_id: CheckoutRequestID,
			});

			console.log("✅ Purchase recorded:", purchase);

			res.json({ success: true });
		} else {
			console.warn("⚠️ STK Callback failed with ResultCode:", ResultCode);
			res.json({ success: false });
		}
	} catch (err) {
		console.error("❌ Error in callback handler:", err.message);
		res.status(500).json({ error: "Callback processing failed" });
	}
};
