/** @format */

import { useEffect, useState } from "react";
import {
	Grid,
	Card,
	CardMedia,
	CardContent,
	Typography,
	Select,
	MenuItem,
	Box,
} from "@mui/material";
import {
	getAllProducts,
	getAllCategories,
	getProductImages,
} from "../api/productApi";

export default function HomePage() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [filter, setFilter] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const cats = await getAllCategories();
			setCategories(cats);

			const prods = await getAllProducts();
			setProducts(await attachImages(prods));
		};

		fetchData();
	}, []);

	const attachImages = async (products) => {
		return await Promise.all(
			products.map(async (p) => {
				const images = await getProductImages(p.id);
				return { ...p, image: images[0]?.image_url || "" };
			})
		);
	};

	const filtered = filter
		? products.filter((p) => p.category_id === filter)
		: products;

	return (
		<Box sx={{ p: 4 }}>
			<Typography variant='h4' gutterBottom>
				Products
			</Typography>

			<Select
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				displayEmpty
				sx={{ mb: 4 }}
			>
				<MenuItem value=''>All Categories</MenuItem>
				{categories.map((cat) => (
					<MenuItem key={cat.id} value={cat.id}>
						{cat.name}
					</MenuItem>
				))}
			</Select>

			<Grid container spacing={3}>
				{filtered.map((product) => (
					<Grid item xs={12} sm={6} md={4} key={product.id}>
						<Card>
							{product.image && (
								<CardMedia
									component='img'
									height='200'
									image={`http://localhost:5000${product.image}`}
									alt={product.name}
								/>
							)}
							<CardContent>
								<Typography variant='h6'>{product.name}</Typography>
								<Typography variant='body2' color='text.secondary'>
									{product.description?.slice(0, 100)}...
								</Typography>
								<Typography variant='subtitle1' sx={{ mt: 1 }}>
									${product.price}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
