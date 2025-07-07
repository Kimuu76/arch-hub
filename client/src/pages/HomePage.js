/** @format */

import React, { useEffect, useState } from "react";
import {
	Grid,
	Card,
	CardMedia,
	CardContent,
	Typography,
	Select,
	MenuItem,
	Box,
	InputLabel,
	FormControl,
	Button,
	Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getAllProducts, getAllCategories } from "../api/productApi";
import { useCart } from "../pages/CartContext";

const BACKEND_BASE_URL = "https://arch-hub-server.onrender.com";

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [filter, setFilter] = useState("");
	const [bedroomFilter, setBedroomFilter] = useState("");
	const [budgetFilter, setBudgetFilter] = useState("");

	const { cart } = useCart();
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

	useEffect(() => {
		const fetchData = async () => {
			const cats = await getAllCategories();
			setCategories(cats);
			const prods = await getAllProducts();
			setProducts(prods);
		};
		fetchData();
	}, []);

	const filtered = products
		.filter((p) => (filter ? p.category_id === filter : true))
		.filter((p) =>
			bedroomFilter ? p.bedrooms === parseInt(bedroomFilter) : true
		)
		.filter((p) => {
			if (budgetFilter === "lt500k") return p.price < 500000;
			if (budgetFilter === "500k-1m")
				return p.price >= 500000 && p.price <= 1000000;
			if (budgetFilter === "gt1m") return p.price > 1000000;
			return true;
		});

	const selectedCategory = categories.find((c) => c.id === filter)?.name;

	return (
		<Box
			sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 }, bgcolor: "#f9f9f9" }}
		>
			{/* Cart Button */}
			<Box display='flex' justifyContent='flex-end' mb={2}>
				<Button
					variant='contained'
					color='primary'
					component={Link}
					to='/cart'
					startIcon={
						<Badge badgeContent={totalItems} color='error'>
							<ShoppingCartIcon />
						</Badge>
					}
				>
					View Cart
				</Button>
			</Box>

			{/* Hero Banner (optional) */}
			<Box
				sx={{
					mb: 6,
					p: 4,
					borderRadius: 3,
					textAlign: "center",
					color: "#fff",
					background: "linear-gradient(to right, #1976d2, #0d47a1)",
				}}
			>
				<Typography variant='h3' fontWeight={700}>
					Elevate Your Dream Home Design
				</Typography>
				<Typography variant='h6' sx={{ mt: 2 }}>
					Explore customizable plans for bungalows, villas, maisonettes & more.
				</Typography>
			</Box>

			{/* Page Title with hidden login link */}
			<Typography variant='h4' fontWeight={700} gutterBottom textAlign='center'>
				Explore Our Arch
				<span style={{ textDecoration: "none" }}>
					<Link
						to='/login'
						style={{
							color: "inherit",
							textDecoration: "none",
							cursor: "pointer",
						}}
					>
						i
					</Link>
				</span>
				tectural Products
			</Typography>

			{/* Services */}
			<Box mt={3} mb={4} textAlign='center'>
				<Typography variant='h5' fontWeight={600}>
					Our Services
				</Typography>
				<Typography variant='body1' mt={1}>
					We offer <strong>architectural</strong> and{" "}
					<strong>structural plans</strong> in sqm or feet/inches, and{" "}
					<strong>construction cost estimates</strong> tailored to your project.
				</Typography>
			</Box>

			{/* Filters */}
			<Box display='flex' flexWrap='wrap' gap={2} mb={4}>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id='category-label'>Category</InputLabel>
					<Select
						labelId='category-label'
						value={filter}
						label='Category'
						onChange={(e) => setFilter(e.target.value)}
					>
						<MenuItem value=''>All Categories</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name === "Massionettes" ? "Maisonettes" : cat.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 160 }}>
					<InputLabel>Bedrooms</InputLabel>
					<Select
						value={bedroomFilter}
						onChange={(e) => setBedroomFilter(e.target.value)}
						label='Bedrooms'
					>
						<MenuItem value=''>All</MenuItem>
						<MenuItem value={2}>2 Bedrooms</MenuItem>
						<MenuItem value={3}>3 Bedrooms</MenuItem>
						<MenuItem value={4}>4 Bedrooms</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 180 }}>
					<InputLabel>Budget</InputLabel>
					<Select
						value={budgetFilter}
						onChange={(e) => setBudgetFilter(e.target.value)}
						label='Budget'
					>
						<MenuItem value=''>All</MenuItem>
						<MenuItem value='lt500k'>Below KES 500K</MenuItem>
						<MenuItem value='500k-1m'>KES 500K - 1M</MenuItem>
						<MenuItem value='gt1m'>Above KES 1M</MenuItem>
					</Select>
				</FormControl>
			</Box>

			{/* Selected Category Display */}
			{filter && (
				<Typography variant='subtitle1' sx={{ mb: 2 }}>
					Showing: <strong>{selectedCategory}</strong>
				</Typography>
			)}

			{/* Product Grid */}
			<Grid container spacing={4}>
				{filtered.map((product) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
						<Card
							component={Link}
							to={`/product/${product.id}`}
							sx={{
								position: "relative",
								textDecoration: "none",
								borderRadius: 3,
								boxShadow: 3,
								overflow: "hidden",
								transition: "all 0.3s ease",
								display: "flex",
								flexDirection: "column",
								"&:hover": {
									boxShadow: 6,
									transform: "translateY(-6px)",
								},
							}}
						>
							<CardMedia
								component='img'
								height='200'
								image={`${BACKEND_BASE_URL}${product.image}`}
								alt={product.name}
								sx={{ objectFit: "cover" }}
							/>

							{product.status === "inactive" && (
								<Box
									sx={{
										position: "absolute",
										top: 8,
										left: 8,
										bgcolor: "red",
										color: "white",
										px: 1.5,
										py: 0.5,
										borderRadius: 1,
										fontSize: "0.75rem",
										fontWeight: "bold",
									}}
								>
									INACTIVE
								</Box>
							)}

							<CardContent sx={{ flexGrow: 1 }}>
								<Typography variant='h6' fontWeight={600} noWrap>
									{product.name}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
									}}
								>
									{product.description}
								</Typography>
								<Typography
									variant='subtitle1'
									sx={{ mt: 2, fontWeight: 700, color: "primary.main" }}
								>
									KES {product.price.toLocaleString()}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default HomePage;
