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
	Drawer,
	List,
	ListItem,
	ListItemText,
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
	useMediaQuery,
	AppBar,
	Toolbar,
	IconButton,
	Dra,
	Divider,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getAllProducts, getAllCategories } from "../api/productApi";
import { useCart } from "../pages/CartContext";
import ProductCard from "../components/ProductCard";
import AboutSection from "../components/AboutSection";
import { useCurrency } from "../context/CurrencyContext";
import HeroCarousel from "../components/HeroSection";

const BACKEND_BASE_URL = "https://arch-hub-server.onrender.com";
//const BACKEND_BASE_URL = "http://localhost:5000";
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

	const HomeRef = useRef(null);
	const filtersRef = useRef(null);
	const productsRef = useRef(null);
	const aboutRef = useRef(null);

	const { currency, rate, toggleCurrency } = useCurrency();

	const sectionRefs = {
		Home: HomeRef,
		filters: filtersRef,
		products: productsRef,
		about: aboutRef,
	};

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("hero");

	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const scrollToSection = (key) => {
		setDrawerOpen(false);
		if (sectionRefs[key]?.current) {
			window.scrollTo({
				top: sectionRefs[key].current.offsetTop - 70,
				behavior: "smooth",
			});
		}
	};

	// Track active section on scroll
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;
			let current = "hero";
			for (const [key, ref] of Object.entries(sectionRefs)) {
				if (ref.current && scrollPosition >= ref.current.offsetTop) {
					current = key;
				}
			}
			setActiveSection(current);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
			{/* Header Navigation Links */}
			<AppBar
				position='sticky'
				color='inherit'
				elevation={2}
				sx={{
					borderRadius: 3,
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Box display='flex' alignItems='center' gap={1} sx={{ mb: 2 }}>
						<img
							src='/logo.svg'
							alt='AMF Logo'
							style={{
								height: 80,
								width: 80,
								objectFit: "contain",
								borderRadius: 8,
							}}
						/>
						<Typography
							variant='h6'
							color='primary'
							fontWeight={600}
							sx={{ whiteSpace: "nowrap" }}
						>
							AMF Home Designs
						</Typography>
					</Box>

					{isMobile ? (
						<>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								<Button
									variant='contained'
									color='primary'
									component={Link}
									to='/cart'
									sx={{ minWidth: 40, p: 1 }}
								>
									<Badge badgeContent={totalItems} color='error'>
										<ShoppingCartIcon />
									</Badge>
								</Button>

								<IconButton edge='end' onClick={() => setDrawerOpen(true)}>
									<MenuIcon fontSize='large' />
								</IconButton>
							</Box>

							<Drawer
								anchor='right'
								open={drawerOpen}
								onClose={() => setDrawerOpen(false)}
								PaperProps={{
									sx: {
										width: 250,
										p: 2,
										display: "flex",
										flexDirection: "column",
										height: "100%",
									},
								}}
							>
								<Box sx={{ flexGrow: 1 }}>
									<Typography variant='h6' fontWeight={700} mb={2}>
										Menu
									</Typography>
									<List>
										{["Home", "filters", "products", "about"].map((section) => (
											<ListItem
												button
												key={section}
												onClick={() => {
													scrollToSection(section);
													setDrawerOpen(false);
												}}
												selected={activeSection === section}
											>
												<ListItemText
													primary={
														section.charAt(0).toUpperCase() + section.slice(1)
													}
												/>
											</ListItem>
										))}
									</List>
								</Box>

								<Divider sx={{ my: 2 }} />

								<Button
									variant='outlined'
									fullWidth
									onClick={() => {
										toggleCurrency();
										setDrawerOpen(false);
									}}
								>
									{loading
										? "Converting..."
										: `Switch to ${currency === "USD" ? "KES" : "USD"}`}
								</Button>
							</Drawer>
						</>
					) : (
						<Box sx={{ display: "flex", gap: 2 }}>
							{["Home", "filters", "products", "about"].map((section) => (
								<Button
									key={section}
									onClick={() => scrollToSection(section)}
									color={activeSection === section ? "primary" : "inherit"}
									variant={activeSection === section ? "contained" : "text"}
									sx={{ fontWeight: 600, textTransform: "none" }}
								>
									{section.charAt(0).toUpperCase() + section.slice(1)}
								</Button>
							))}
							<Button variant='contained' onClick={toggleCurrency}>
								{loading
									? "Converting..."
									: `Switch to ${currency === "USD" ? "KES" : "USD"}`}
							</Button>
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
							></Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			{/* Hero Section */}

			<div ref={HomeRef}>
				<HeroCarousel
					featured={featured}
					rate={rate}
					currency={currency}
					HomeRef={HomeRef}
				/>
			</div>

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
				ref={filtersRef}
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
				<Grid ref={productsRef} container spacing={3}>
					{visibleProducts.map((product) => (
						<Grid item xs={12} sm={6} md={3} key={product.id}>
							<ProductCard product={product} />
						</Grid>
					))}
				</Grid>
			)}

			{/* About Section */}
			<div ref={aboutRef}>
				<AboutSection />
			</div>

			{/* Infinite Scroll Observer */}
			{!loading && visibleCount < filtered.length && (
				<Box ref={observerRef} sx={{ height: 50 }} />
			)}

			<ScrollTop />
		</Box>
	);
};

export default HomePage;
