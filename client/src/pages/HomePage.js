/** @format */

import React, { useEffect, useState, useMemo, useRef } from "react";
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
	TextField,
	Skeleton,
	useTheme,
	Fab,
	Zoom,
	useScrollTrigger,
} from "@mui/material";
import { Link } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getAllProducts, getAllCategories } from "../api/productApi";
import { useCart } from "../pages/CartContext";
import ProductCard from "../components/ProductCard";

const BACKEND_BASE_URL = "http://localhost:5000";
const itemsPerLoad = 8;

const ScrollTop = () => {
	const trigger = useScrollTrigger({ threshold: 300 });
	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Zoom in={trigger}>
			<Box
				onClick={handleClick}
				role='presentation'
				sx={{
					position: "fixed",
					bottom: 32,
					right: 24,
					zIndex: 1000,
				}}
			>
				<Fab color='primary' size='small' aria-label='scroll back to top'>
					<KeyboardArrowUpIcon />
				</Fab>
			</Box>
		</Zoom>
	);
};

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [filter, setFilter] = useState("");
	const [bedroomFilter, setBedroomFilter] = useState("");
	const [budgetFilter, setBudgetFilter] = useState("");
	const [search, setSearch] = useState("");
	const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
	const [loading, setLoading] = useState(true);

	const { cart } = useCart();
	const theme = useTheme();
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	const observerRef = useRef();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const cats = await getAllCategories();
			const prods = await getAllProducts();
			setCategories(cats);
			setProducts(prods);
			setLoading(false);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setVisibleCount((prev) => prev + itemsPerLoad);
				}
			},
			{ threshold: 1 }
		);
		if (observerRef.current) observer.observe(observerRef.current);
		return () => observer.disconnect();
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
		})
		.filter((p) =>
			search.trim()
				? p.title?.toLowerCase().includes(search.toLowerCase())
				: true
		);

	const visibleProducts = useMemo(
		() => filtered.slice(0, visibleCount),
		[filtered, visibleCount]
	);

	const featured = useMemo(() => {
		return products
			.filter((p) => p.status !== "inactive")
			.sort(() => 0.5 - Math.random())
			.slice(0, 5);
	}, [products]);

	const isImageFile = (filename) =>
		/\.(jpg|jpeg|png|webp|gif)$/i.test(filename);

	return (
		<Box sx={{ px: { xs: 2, md: 6 }, py: 4, bgcolor: "#f9f9f9" }}>
			{/* Cart */}
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

			{/* Combined Hero Section with CTA + Carousel */}
			<Box
				sx={{
					minHeight: { xs: 500, md: 600 },
					background: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(/hero.jpg) center/cover no-repeat`,
					color: "#fff",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					borderRadius: 3,
					p: { xs: 3, md: 6 },
					mb: 6,
				}}
			>
				{/* Headline */}
				<Typography variant='h3' fontWeight={800}>
					Affordable, Ready-to-Build House Designs
				</Typography>

				{/* Subtitle */}
				<Typography variant='h6' mt={2} mb={3}>
					Plans for modern living – from bungalows to villas
				</Typography>

				{/* CTA Button */}
				<Button
					variant='contained'
					size='large'
					color='secondary'
					component={Link}
					to='/shop'
					sx={{ mb: 4 }}
				>
					🛒 Browse Designs
				</Button>

				{/* Featured Carousel */}
				{featured.length > 0 && (
					<Box sx={{ width: "100%", maxWidth: 1000 }}>
						<Carousel
							showThumbs={false}
							autoPlay
							infiniteLoop
							showStatus={false}
							showArrows
							emulateTouch
						>
							{featured.map((product) => (
								<div key={product.id}>
									<img
										src={`${BACKEND_BASE_URL}${product.image}`}
										alt={product.title}
										style={{
											height: 400,
											objectFit: "cover",
											width: "100%",
											borderRadius: 8,
										}}
									/>
									<p className='legend'>
										<Link
											to={`/product/${product.id}`}
											style={{
												color: "#fff",
												fontWeight: "bold",
												textShadow: "1px 1px 2px black",
											}}
										>
											{product.title} – KES {product.price.toLocaleString()}
										</Link>
									</p>
								</div>
							))}
						</Carousel>
					</Box>
				)}
			</Box>

			{/* Banner */}
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
				<Typography variant='h4' fontWeight={700}>
					Elevate Your Dream Home Design
				</Typography>
				<Typography variant='body1' mt={1}>
					Explore customizable plans for bungalows, villas, maisonettes & more.
				</Typography>
			</Box>

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

			{/* Filters */}
			<Box
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 1000,
					bgcolor: theme.palette.background.paper,
					p: 2,
					boxShadow: 2,
					borderRadius: 2,
					mb: 4,
				}}
				display='flex'
				flexWrap='wrap'
				justifyContent='center'
				gap={2}
			>
				<FormControl sx={{ minWidth: 180 }}>
					<InputLabel>Category</InputLabel>
					<Select
						value={filter}
						label='Category'
						onChange={(e) => setFilter(e.target.value)}
					>
						<MenuItem value=''>All</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label='Search'
					variant='outlined'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setVisibleCount(itemsPerLoad);
					}}
				/>

				<FormControl sx={{ minWidth: 140 }}>
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

				<FormControl sx={{ minWidth: 160 }}>
					<InputLabel>Budget</InputLabel>
					<Select
						value={budgetFilter}
						onChange={(e) => setBudgetFilter(e.target.value)}
						label='Budget'
					>
						<MenuItem value=''>All</MenuItem>
						<MenuItem value='lt500k'>Below 500K</MenuItem>
						<MenuItem value='500k-1m'>500K – 1M</MenuItem>
						<MenuItem value='gt1m'>Above 1M</MenuItem>
					</Select>
				</FormControl>
			</Box>

			{/* Product List - Vertical Layout for Better UX */}
			{loading ? (
				Array.from({ length: 4 }).map((_, i) => (
					<Box
						key={i}
						sx={{
							p: 2,
							bgcolor: "#fff",
							borderRadius: 3,
							boxShadow: 2,
							mb: 4,
						}}
					>
						<Skeleton
							variant='rectangular'
							height={200}
							sx={{ borderRadius: 2 }}
						/>
						<Skeleton variant='text' height={30} width='60%' sx={{ mt: 2 }} />
						<Skeleton variant='text' width='80%' />
						<Skeleton variant='text' width='40%' />
					</Box>
				))
			) : (
				<Grid container spacing={3}>
					{visibleProducts.map((product) => (
						<Grid item xs={12} sm={6} md={4} key={product.id}>
							<ProductCard product={product} />
						</Grid>
					))}
				</Grid>
			)}

			{/* About / Contact Section */}
			<Box
				sx={{
					mt: 8,
					p: 4,
					textAlign: "center",
					bgcolor: "#e3f2fd",
					borderRadius: 3,
				}}
			>
				<Typography variant='h5' fontWeight={700}>
					About ArchiManfe
				</Typography>
				<Typography mt={1}>
					"I'm passionate about empowering families to build affordable homes
					with smart, ready-to-build plans. ArchiManfe started from a simple
					mission: to make architecture more accessible."
				</Typography>
				<Typography mt={2}>
					📞 WhatsApp:{" "}
					<a href='https://wa.me/254717365839' target='_blank' rel='noreferrer'>
						254717365839
					</a>{" "}
					| ✉️ Email: info@archimanfe.com
				</Typography>
			</Box>

			{/* Infinite Scroll Observer */}
			{!loading && visibleCount < filtered.length && (
				<Box ref={observerRef} sx={{ height: 50 }} />
			)}

			<ScrollTop />
		</Box>
	);
};

export default HomePage;
