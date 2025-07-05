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

const BACKEND_BASE_URL = "http://localhost:5000";

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [filter, setFilter] = useState("");

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

	const filtered = filter
		? products.filter((p) => p.category_id === filter)
		: products;

	const selectedCategory = categories.find((c) => c.id === filter)?.name;

	return (
		<Box
			sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 }, bgcolor: "#f9f9f9" }}
		>
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

			{/* Hero Banner 
			<Box
				sx={{
					mb: 6,
					p: 4,
					borderRadius: 3,
					textAlign: "center",
					color: "#fff",
					backgroundImage: 'url("../assets/asset.jpg")',
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<Typography variant='h3' fontWeight={700}>
					Affordable House Plans & Designs
				</Typography>
				<Typography variant='h6' sx={{ mt: 2 }}>
					Ready-to-build architectural plans for all your needs
				</Typography>
			</Box>*/}

			<Typography variant='h4' fontWeight={700} gutterBottom textAlign='center'>
				Explore Our Architectural Products
			</Typography>

			<FormControl sx={{ mb: 4, minWidth: 250 }}>
				<InputLabel id='category-label'>Filter by Category</InputLabel>
				<Select
					labelId='category-label'
					value={filter}
					label='Filter by Category'
					onChange={(e) => setFilter(e.target.value)}
				>
					<MenuItem value=''>All Categories</MenuItem>
					{categories.map((cat) => (
						<MenuItem key={cat.id} value={cat.id}>
							{cat.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Selected Category Label */}
			{filter && (
				<Typography variant='subtitle1' sx={{ mb: 2 }}>
					Showing: <strong>{selectedCategory}</strong>
				</Typography>
			)}

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
							{/* Product Image */}
							<CardMedia
								component='img'
								height='200'
								image={`${BACKEND_BASE_URL}${product.image}`}
								alt={product.name}
								sx={{ objectFit: "cover" }}
							/>

							{/* Show INACTIVE label if needed */}
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
									KES {product.price}
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
