/** @format */

import {
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	Alert,
	Paper,
	Divider,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import axios from "../api/axios";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

const CheckoutPage = () => {
	const { cart, dispatch } = useCart();
	const navigate = useNavigate();

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const clearCart = () => dispatch({ type: "CLEAR_CART" });

	const [form, setForm] = useState({
		customer_name: "",
		customer_email: "",
		customer_phone: "",
		shipping_address: "",
		payment_method: "mpesa",
		mpesa_code: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	/*const validate = () => {
		let temp = {};
		temp.customer_name = form.customer_name ? "" : "Name is required";
		temp.customer_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)
			? ""
			: "Enter a valid email";
		temp.customer_phone = /^2547\d{8}$/.test(form.customer_phone)
			? ""
			: "Use format: 2547XXXXXXXX";
		temp.shipping_address = form.shipping_address ? "" : "Address is required";
		setErrors(temp);
		return Object.values(temp).every((x) => x === "");
	};

	useEffect(() => {
		validate();
	}, [form]);*/

	if (cart.length === 0) {
		return (
			<Box sx={{ p: 4 }}>
				<Alert severity='info'>Your cart is empty. Add items first.</Alert>
			</Box>
		);
	}

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		setLoading(true);
		setError("");

		if (!form.mpesa_code || form.mpesa_code.length < 10) {
			setError("Please enter a valid M-Pesa confirmation code.");
			setLoading(false);
			return;
		}

		try {
			const tokenMap = JSON.parse(
				localStorage.getItem("purchaseTokens") || "{}"
			);

			for (const item of cart) {
				const res = await axios.post("/purchases", {
					product_id: item.id,
					phone: form.customer_phone,
					amount: item.price,
					external_id: form.mpesa_code,
				});
				tokenMap[item.id] = res.data.token;
			}

			localStorage.setItem("purchaseTokens", JSON.stringify(tokenMap));

			clearCart();
			alert(
				"✅ Payment recorded successfully. You can now download your plan(s)."
			);
			navigate("/");
		} catch (err) {
			console.error("❌ Failed to create purchase:", err);
			setError("Failed to record payment. Please check the details.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
			<Button variant='outlined' onClick={() => navigate(-1)} sx={{ mb: 3 }}>
				← Back
			</Button>
			<Typography variant='h4' gutterBottom fontWeight={600}>
				🔒 Secure Checkout
			</Typography>

			<Alert severity='info' sx={{ mb: 3 }}>
				<strong>Payment Instructions:</strong> Send the total amount to{" "}
				<strong>0717 365839</strong> via M-Pesa. Then enter the M-Pesa
				confirmation code in the field below (e.g., <em>TG893J2NU7</em>).
			</Alert>

			<Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<TextField
							name='customer_name'
							label='Full Name'
							fullWidth
							onChange={handleChange}
							value={form.customer_name}
							error={!!errors.customer_name}
							helperText={errors.customer_name}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							name='customer_email'
							label='Email Address'
							type='email'
							fullWidth
							onChange={handleChange}
							value={form.customer_email}
							error={!!errors.customer_email}
							helperText={errors.customer_email}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							name='customer_phone'
							label='Phone (e.g. 2547XXXXXXXX)'
							fullWidth
							onChange={handleChange}
							value={form.customer_phone}
							error={!!errors.customer_phone}
							helperText={errors.customer_phone}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name='mpesa_code'
							label='M-Pesa Confirmation Code'
							fullWidth
							value={form.mpesa_code}
							onChange={handleChange}
							required
						/>
						<Typography variant='caption' color='text.secondary'>
							After sending payment via M-Pesa, enter the confirmation code here
							(e.g., TG893J2NU7).
						</Typography>
					</Grid>

					{/*<Grid item xs={12}>
						<TextField
							name='shipping_address'
							label='Shipping Address'
							fullWidth
							multiline
							minRows={3}
							onChange={handleChange}
							value={form.shipping_address}
							error={!!errors.shipping_address}
							helperText={errors.shipping_address}
						/>
					</Grid>*/}

					<Grid item xs={12}>
						<FormControl component='fieldset'>
							<FormLabel component='legend'>Payment Method</FormLabel>
							<RadioGroup
								row
								name='payment_method'
								value={form.payment_method}
								onChange={handleChange}
							>
								<FormControlLabel
									value='mpesa'
									control={<Radio />}
									label={
										<Box display='flex' alignItems='center'>
											<PhoneIphoneIcon sx={{ mr: 0.5 }} /> M-Pesa
										</Box>
									}
								/>
								{/*<FormControlLabel
									value='card'
									control={<Radio />}
									label={
										<Box display='flex' alignItems='center'>
											<CreditCardIcon sx={{ mr: 0.5 }} /> Credit / Debit Card
										</Box>
									}
								/>*/}
							</RadioGroup>
						</FormControl>
					</Grid>
				</Grid>

				<Divider sx={{ my: 4 }} />

				<Box
					display='flex'
					flexDirection={{ xs: "column", sm: "row" }}
					justifyContent='space-between'
					alignItems={{ xs: "flex-start", sm: "center" }}
					gap={2}
				>
					<Typography variant='h6' fontWeight={600}>
						Total:{" "}
						<span style={{ color: "#1976d2" }}>
							KES {total.toLocaleString()}
						</span>
					</Typography>

					<Button
						variant='contained'
						color='primary'
						onClick={handleSubmit}
						disabled={loading}
						size='large'
					>
						{loading ? "Placing Order..." : "Place Order"}
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default CheckoutPage;
