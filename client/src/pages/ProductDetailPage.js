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
	Badge,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";
import axios from "../api/axios";
//import { useParams } from "react-router-dom";
import { useCart } from "../pages/CartContext";

const BACKEND_BASE_URL = "http://localhost:5000";

const ProductDetailPage = () => {
	const { id: productId } = useParams();
	const navigate = useNavigate();
	const { dispatch, cart } = useCart();
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

	const [hasPurchased, setHasPurchased] = useState(false);
	const [user, setUser] = useState(null); // Optional: replace with your auth system

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [product, setProduct] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tabIndex, setTabIndex] = useState(0);

	const [downloadable, setDownloadable] = useState(false);

	useEffect(() => {
		const checkDownloadAccess = async () => {
			const tokenMap = JSON.parse(
				localStorage.getItem("purchaseTokens") || "{}"
			);
			const token = tokenMap[productId];
			if (!token) return;

			try {
				const res = await axios.get(`/purchases/validate`, {
					params: { product_id: productId, token },
				});
				setDownloadable(res.data.valid);
			} catch (err) {
				console.error("❌ Download access check failed:", err);
			}
		};

		checkDownloadAccess();
	}, [productId]);

	useEffect(() => {
		const fetchProductAndRelated = async () => {
			try {
				const res = await axios.get(`/products/${productId}`);
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
	}, [productId]);

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' mt={8}>
				<CircularProgress size={40} />
			</Box>
		);
	}

	if (!product) {
		return (
			<Typography textAlign='center' mt={4}>
				Product not found.
			</Typography>
		);
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

	const tokenMap = JSON.parse(localStorage.getItem("purchaseTokens") || "{}");
	const token = tokenMap[productId];

	return (
		<Box sx={{ px: { xs: 2, md: 6 }, py: 5, bgcolor: "#f9f9f9" }}>
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

			<Button onClick={() => navigate(-1)} sx={{ mb: 3 }}>
				← Back
			</Button>

			<Grid container spacing={5}>
				{/* Images */}
				<Grid item xs={12} md={6}>
					<Paper elevation={3} sx={{ borderRadius: 3, p: 1 }}>
						<Carousel
							showThumbs={!isMobile}
							autoPlay
							infiniteLoop
							showStatus={false}
							showArrows
							emulateTouch
						>
							{(product.images?.length ? product.images : [product.image]).map(
								(img, i) => (
									<div key={i}>
										<img
											src={`${BACKEND_BASE_URL}${img}`}
											alt={`${product.title} ${i + 1}`}
											style={{
												maxHeight: 450,
												objectFit: "cover",
												width: "100%",
											}}
										/>
									</div>
								)
							)}
						</Carousel>
					</Paper>
				</Grid>

				{/* Product Info */}
				<Grid item xs={12} md={6}>
					<Typography variant='h4' fontWeight={700} gutterBottom>
						{product.title}
					</Typography>

					<Typography
						variant='h5'
						color='primary'
						fontWeight={600}
						sx={{ mb: 2 }}
					>
						KES {product.price.toLocaleString()}
					</Typography>

					<Typography variant='body1' sx={{ mb: 3 }}>
						{product.short_description || product.description?.slice(0, 200)}
					</Typography>

					<Button
						variant='contained'
						color='primary'
						onClick={handleAddToCart}
						sx={{ px: 4, py: 1.2, fontWeight: 600 }}
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

			{/* Tabs Section */}
			<Box mt={6}>
				<Tabs
					value={tabIndex}
					onChange={(e, val) => setTabIndex(val)}
					indicatorColor='primary'
					textColor='primary'
					variant='scrollable'
					scrollButtons='auto'
				>
					<Tab label='Overview' />
					{product.plan_file && <Tab label='Plan File' />}
					<Tab label='Specifications' />
					<Tab label='Reviews' />
				</Tabs>

				<Divider sx={{ my: 2 }} />

				{/* Overview */}
				{tabIndex === 0 && (
					<Typography variant='body1' sx={{ lineHeight: 1.8 }}>
						{product.description}
					</Typography>
				)}

				{/* Plan File */}
				{tabIndex === 1 && product.plan_file && (
					<Box>
						<Button
							variant='contained'
							color='primary'
							component='a'
							href={
								downloadable && product.status === "active"
									? `http://localhost:5000/api/products/${product.id}/download?token=${token}`
									: undefined
							}
							disabled={!downloadable || product.status === "inactive"}
							sx={{ mt: 2 }}
						>
							{product.status === "inactive"
								? "Unavailable"
								: downloadable
								? "Download Plan File"
								: "Purchase to Download"}
						</Button>

						{(!downloadable || product.status === "inactive") && (
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ mt: 1, display: "block" }}
							>
								{product.status === "inactive"
									? "This plan is unavailable for download."
									: "You must purchase this plan to unlock the download."}
							</Typography>
						)}
					</Box>
				)}

				{/* Specifications */}
				{tabIndex === 2 && (
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
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
						<Grid item xs={12} sm={6}>
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

				{/* Reviews Placeholder */}
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
										borderRadius: 3,
										boxShadow: 2,
										transition: "0.3s",
										"&:hover": {
											transform: "scale(1.02)",
											boxShadow: 4,
										},
									}}
								>
									<CardMedia
										component='img'
										height='140'
										image={`${BACKEND_BASE_URL}${p.image}`}
										alt={p.title}
										sx={{ objectFit: "cover" }}
									/>
									<CardContent>
										<Typography variant='subtitle1' fontWeight={600} noWrap>
											{p.title}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											KES {p.price.toLocaleString()}
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
