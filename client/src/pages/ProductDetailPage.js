/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	Box,
	Typography,
	Card,
	CardMedia,
	CardContent,
	Button,
	Grid,
	CircularProgress,
	Tabs,
	Tab,
	Divider,
	Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useCart } from "../pages/CartContext";

const BACKEND_BASE_URL = "https://arch-hub-server.onrender.com";

const ProductDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { dispatch } = useCart();

	const [product, setProduct] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tabIndex, setTabIndex] = useState(0);

	useEffect(() => {
		const fetchProductAndRelated = async () => {
			try {
				const res = await axios.get(`/products/${id}`);
				const prod = res.data;
				setProduct(prod);

				const relatedRes = await axios.get(`/products`);
				const related = relatedRes.data
					.filter((p) => p.category_id === prod.category_id && p.id !== prod.id)
					.slice(0, 4);
				setRelatedProducts(related);
			} catch (err) {
				console.error("Error:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchProductAndRelated();
	}, [id]);

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' mt={6}>
				<CircularProgress />
			</Box>
		);
	}

	if (!product) {
		return <Typography textAlign='center'>Product not found</Typography>;
	}

	const handleAddToCart = () => {
		dispatch({
			type: "ADD_ITEM",
			payload: {
				id: product.id,
				name: product.title,
				price: product.price,
				image: product.image,
			},
		});
		toast.success(`${product.title} added to cart!`);
	};

	return (
		<Box
			sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 }, bgcolor: "#f9f9f9" }}
		>
			<Button variant='outlined' onClick={() => navigate(-1)} sx={{ mb: 3 }}>
				← Back
			</Button>

			<Grid container spacing={4}>
				{/* Image */}
				<Grid item xs={12} md={6}>
					<Paper
						elevation={3}
						sx={{
							overflow: "hidden",
							borderRadius: 2,
							p: 1,
						}}
					>
						<CardMedia
							component='img'
							image={`${BACKEND_BASE_URL}${product.image}`}
							alt={product.name}
							sx={{
								width: "100%",
								objectFit: "cover",
								borderRadius: 2,
								cursor: "zoom-in",
							}}
							onClick={() =>
								window.open(`${BACKEND_BASE_URL}${product.image}`, "_blank")
							}
						/>
					</Paper>
				</Grid>

				{/* Product Info */}
				<Grid item xs={12} md={6}>
					<Typography variant='h4' fontWeight={700} gutterBottom>
						{product.name}
					</Typography>
					<Typography variant='h6' color='primary' gutterBottom>
						KES {product.price}
					</Typography>
					<Typography variant='body1' sx={{ mb: 3 }}>
						{product.short_description || product.description?.slice(0, 200)}
					</Typography>
					<Button
						variant='contained'
						color='primary'
						onClick={handleAddToCart}
						sx={{ px: 4, py: 1 }}
						disabled={product.status === "inactive"}
					>
						{product.status === "inactive" ? "Unavailable" : "Add to Cart"}
					</Button>
					{product.status === "inactive" && (
						<Typography variant='body2' color='error' mt={2}>
							This product is currently inactive and cannot be added to the
							cart.
						</Typography>
					)}
				</Grid>
			</Grid>

			{/* Tabs */}
			<Box sx={{ mt: 6 }}>
				<Tabs
					value={tabIndex}
					onChange={(e, newVal) => setTabIndex(newVal)}
					indicatorColor='primary'
					textColor='primary'
					variant='scrollable'
				>
					<Tab label='Overview' />
					{product.plan_file && <Tab label='Plan File' />}
					<Tab label='Specifications' />
					<Tab label='Reviews' />
				</Tabs>

				<Divider sx={{ my: 2 }} />

				{/* Overview Tab */}
				{tabIndex === 0 && (
					<Box>
						<Typography variant='body1'>{product.description}</Typography>
					</Box>
				)}

				{tabIndex === 1 && product.plan_file && (
					<Button
						variant='outlined'
						href={`${BACKEND_BASE_URL}${product.plan_file}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						Download Plan File
					</Button>
				)}

				{/* Specifications Tab */}
				{tabIndex === 2 && (
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography>
								<strong>Bedrooms:</strong> {product.bedrooms || "N/A"}
							</Typography>
							<Typography>
								<strong>Bathrooms:</strong> {product.bathrooms || "N/A"}
							</Typography>
							<Typography>
								<strong>Stories:</strong> {product.stories || "N/A"}
							</Typography>
							<Typography>
								<strong>Category:</strong> {product.category_name || "N/A"}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography>
								<strong>Plot Size:</strong> {product.plot_size || "N/A"}
							</Typography>
							<Typography>
								<strong>Roof Type:</strong> {product.roof_type || "N/A"}
							</Typography>
							<Typography>
								<strong>Style:</strong> {product.style || "N/A"}
							</Typography>
						</Grid>
					</Grid>
				)}

				{/* Reviews Tab */}
				{tabIndex === 3 && (
					<Typography variant='body2' color='text.secondary'>
						Reviews feature coming soon!
					</Typography>
				)}
			</Box>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<Box mt={8}>
					<Typography variant='h5' fontWeight={600} gutterBottom>
						You may also like
					</Typography>
					<Grid container spacing={3}>
						{relatedProducts.map((p) => (
							<Grid item xs={12} sm={6} md={3} key={p.id}>
								<Card
									component={Link}
									to={`/product/${p.id}`}
									sx={{
										textDecoration: "none",
										borderRadius: 2,
										boxShadow: 2,
										transition: "0.3s",
										"&:hover": {
											transform: "translateY(-5px)",
											boxShadow: 4,
										},
									}}
								>
									<CardMedia
										component='img'
										height='140'
										image={`${BACKEND_BASE_URL}${p.image}`}
										alt={p.name}
										sx={{ objectFit: "cover" }}
									/>
									<CardContent>
										<Typography variant='subtitle1' fontWeight={600} noWrap>
											{p.name}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											KES {p.price}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>
			)}
		</Box>
	);
};

export default ProductDetailPage;
