/** @format */

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	Box,
	Typography,
	Button,
	Card,
	CardMedia,
	CardActions,
	Grid,
	IconButton,
	Divider,
	Paper,
	Fade,
	Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../pages/CartContext";
import { useCurrency } from "../context/CurrencyContext";

const BACKEND_BASE_URL = "https://arch-hub-server.onrender.com";

const CartPage = () => {
	const { cart, dispatch } = useCart();
	const { currency, rate, toggleCurrency } = useCurrency();
	const navigate = useNavigate();

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const convertedTotal = total * rate;

	const handleRemove = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
	const handleClear = () => dispatch({ type: "CLEAR_CART" });
	const handleIncreaseQty = (id) =>
		dispatch({ type: "INCREASE_QUANTITY", payload: id });
	const handleDecreaseQty = (id) =>
		dispatch({ type: "DECREASE_QUANTITY", payload: id });

	// Auto redirect if cart is empty
	useEffect(() => {
		if (cart.length === 0) {
			const timer = setTimeout(() => navigate("/"), 3000);
			return () => clearTimeout(timer);
		}
	}, [cart, navigate]);

	// Empty cart UI
	if (cart.length === 0) {
		return (
			<Box
				p={4}
				textAlign='center'
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
				minHeight='60vh'
			>
				<ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "gray", mb: 2 }} />
				<Typography variant='h5' gutterBottom>
					Your cart is currently empty.
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					Redirecting to product list...
				</Typography>
				<Button
					component={Link}
					to='/'
					variant='contained'
					size='large'
					sx={{ mt: 3 }}
				>
					Browse Products Now
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent='space-between'
				alignItems={{ xs: "flex-start", sm: "center" }}
				spacing={2}
				mb={3}
			>
				<Button variant='outlined' onClick={() => navigate(-1)}>
					← Continue Shopping
				</Button>
				<Typography variant='h4' fontWeight={700}>
					My Cart
				</Typography>
				<Button variant='contained' onClick={toggleCurrency}>
					Switch to {currency === "KES" ? "USD" : "KES"}
				</Button>
			</Stack>

			<Grid container spacing={4}>
				{/* Cart Items */}
				<Grid item xs={12} md={8}>
					<Grid container spacing={3}>
						{cart.map((item) => (
							<Grid item xs={12} key={item.id}>
								<Fade in timeout={400}>
									<Card
										sx={{
											display: "flex",
											alignItems: "center",
											p: 2,
											boxShadow: 3,
											borderRadius: 2,
											transition: "0.3s",
											"&:hover": { boxShadow: 6 },
										}}
									>
										<CardMedia
											component='img'
											image={`${BACKEND_BASE_URL}${item.image}`}
											sx={{
												width: 100,
												height: 100,
												objectFit: "cover",
												borderRadius: 2,
												mr: 2,
											}}
										/>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant='h6'>{item.name}</Typography>
											<Typography color='text.secondary' fontSize={14}>
												{(item.price * rate).toLocaleString(undefined, {
													style: "currency",
													currency,
													minimumFractionDigits: 2,
												})}{" "}
												each
											</Typography>

											<Box display='flex' alignItems='center' mt={1}>
												<IconButton
													size='small'
													onClick={() => handleDecreaseQty(item.id)}
													disabled={item.quantity <= 1}
												>
													<RemoveIcon />
												</IconButton>
												<Typography
													variant='body1'
													sx={{
														mx: 2,
														minWidth: 20,
														textAlign: "center",
														fontWeight: 500,
													}}
												>
													{item.quantity}
												</Typography>
												<IconButton
													size='small'
													onClick={() => handleIncreaseQty(item.id)}
												>
													<AddIcon />
												</IconButton>
											</Box>
										</Box>
										<CardActions>
											<IconButton
												onClick={() => handleRemove(item.id)}
												color='error'
											>
												<DeleteIcon />
											</IconButton>
										</CardActions>
									</Card>
								</Fade>
							</Grid>
						))}
					</Grid>
				</Grid>

				{/* Order Summary */}
				<Grid item xs={12} md={4}>
					<Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant='h6' fontWeight={600} gutterBottom>
							Order Summary
						</Typography>
						<Divider sx={{ mb: 2 }} />
						<Box display='flex' justifyContent='space-between' mb={1}>
							<Typography variant='subtitle2'>Total Items</Typography>
							<Typography variant='subtitle2'>
								{cart.reduce((sum, item) => sum + item.quantity, 0)}
							</Typography>
						</Box>
						<Box display='flex' justifyContent='space-between'>
							<Typography variant='subtitle1' fontWeight={600}>
								Total Price
							</Typography>
							<Typography variant='subtitle1' fontWeight={600}>
								{convertedTotal.toLocaleString(undefined, {
									style: "currency",
									currency,
									minimumFractionDigits: 2,
								})}
							</Typography>
						</Box>

						<Button
							variant='outlined'
							color='error'
							fullWidth
							onClick={handleClear}
							sx={{ mt: 3 }}
						>
							Clear Cart
						</Button>
						<Button
							variant='contained'
							color='primary'
							fullWidth
							size='large'
							startIcon={<ShoppingCartCheckoutIcon />}
							sx={{ mt: 2 }}
							component={Link}
							to='/checkout'
						>
							Proceed to Checkout
						</Button>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CartPage;
