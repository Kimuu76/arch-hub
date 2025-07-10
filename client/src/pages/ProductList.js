/** @format */

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
	Box,
	Grid,
	Typography,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Skeleton,
	Button,
	useTheme,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";

const ITEMS_PER_PAGE = 6;

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
	const [loading, setLoading] = useState(true);

	const observerRef = useRef();
	const theme = useTheme();

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const productRes = await axios.get("/products");
			const categoryRes = await axios.get("/categories");
			setProducts(productRes.data);
			setCategories(categoryRes.data);
		} catch (err) {
			console.error("Error loading products:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
				}
			},
			{ threshold: 1 }
		);

		if (observerRef.current) observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, []);

	const filtered = useMemo(() => {
		return products
			.filter((p) =>
				selectedCategory ? p.category_id === selectedCategory : true
			)
			.filter((p) =>
				search.trim()
					? p.title?.toLowerCase().includes(search.toLowerCase())
					: true
			);
	}, [products, selectedCategory, search]);

	const visibleProducts = filtered.slice(0, visibleCount);

	return (
		<Box sx={{ px: { xs: 2, md: 6 }, py: 4, bgcolor: "#f9f9f9" }}>
			<Button onClick={() => navigate(-1)} sx={{ mb: 3 }}>
				← Back
			</Button>
			{/* Title */}
			<Typography variant='h4' fontWeight={700} textAlign='center' mb={3}>
				Browse All Architectural Plans
			</Typography>

			{/* Filters */}
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					gap: 2,
					justifyContent: "center",
					mb: 4,
					bgcolor: "#fff",
					p: 2,
					borderRadius: 2,
					boxShadow: 2,
				}}
			>
				<TextField
					label='Search by title'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setVisibleCount(ITEMS_PER_PAGE);
					}}
				/>

				<FormControl sx={{ minWidth: 160 }}>
					<InputLabel>Category</InputLabel>
					<Select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						label='Category'
					>
						<MenuItem value=''>All</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* Product Grid */}
			<Grid container spacing={3}>
				{loading
					? Array.from({ length: 6 }).map((_, i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Box
									sx={{
										bgcolor: "#fff",
										borderRadius: 2,
										p: 2,
										boxShadow: 2,
										height: "100%",
									}}
								>
									<Skeleton variant='rectangular' height={220} />
									<Skeleton variant='text' sx={{ mt: 2 }} />
									<Skeleton width='60%' />
								</Box>
							</Grid>
					  ))
					: visibleProducts.map((product) => (
							<Grid item xs={12} sm={6} md={4} key={product.id}>
								<ProductCard product={product} />
							</Grid>
					  ))}
			</Grid>

			{/* Infinite Scroll Observer */}
			{!loading && visibleCount < filtered.length && (
				<Box ref={observerRef} sx={{ height: 60 }} />
			)}

			{/* No Results */}
			{!loading && visibleProducts.length === 0 && (
				<Typography textAlign='center' mt={5} color='text.secondary'>
					No products match your search or filters.
				</Typography>
			)}
		</Box>
	);
};

export default ProductList;
