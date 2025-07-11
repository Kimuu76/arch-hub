/** @format */

import React from "react";
import {
	Box,
	Button,
	CardMedia,
	Grid,
	Typography,
	Rating,
	useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import StairsIcon from "@mui/icons-material/Stairs";
import StraightenIcon from "@mui/icons-material/Straighten";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { toast } from "react-toastify";
import { useCart } from "../pages/CartContext";

const BACKEND_BASE_URL = "https://arch-hub-server.onrender.com";

const ProductCard = ({ product }) => {
	const theme = useTheme();
	const { dispatch } = useCart();

	const handleAddToCart = () => {
		dispatch({
			type: "ADD_ITEM",
			payload: {
				id: product.id,
				name: product.title,
				price: product.price,
				image: product.image,
				plan_file: product.plan_file,
			},
		});
		toast.success(`${product.title} added to cart!`);
	};

	const ratingValue = product.rating || 4.5;

	return (
		<Box
			sx={{
				bgcolor: "#fff",
				borderRadius: 3,
				boxShadow: 3,
				p: 2,
				position: "relative",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				transition: "transform 0.3s, box-shadow 0.3s",
				"&:hover": {
					transform: "translateY(-5px)",
					boxShadow: 6,
				},
			}}
		>
			{/* Best Seller Badge */}
			{product.featured && (
				<Box
					sx={{
						position: "absolute",
						top: 12,
						right: 12,
						bgcolor: "purple",
						color: "#fff",
						px: 1.5,
						py: 0.4,
						fontSize: "0.75rem",
						fontWeight: 700,
						borderRadius: "12px",
						zIndex: 2,
					}}
				>
					Best Seller
				</Box>
			)}

			{/* Inactive Badge */}
			{product.status === "inactive" && (
				<Box
					sx={{
						position: "absolute",
						top: 12,
						left: 12,
						bgcolor: "red",
						color: "#fff",
						px: 1.5,
						py: 0.4,
						fontSize: "0.75rem",
						fontWeight: 700,
						borderRadius: "12px",
						zIndex: 2,
					}}
				>
					INACTIVE
				</Box>
			)}

			{/* Main Product Image */}
			<CardMedia
				component='img'
				image={`${BACKEND_BASE_URL}${product.image}`}
				alt={product.title}
				sx={{
					height: 220,
					width: "100%",
					objectFit: "cover",
					borderRadius: 2,
					mb: 2,
				}}
			/>

			{/* Title */}
			<Typography variant='h6' fontWeight={700} gutterBottom noWrap>
				{product.title}
			</Typography>

			{/* Price */}
			<Typography variant='subtitle2' color='text.secondary'>
				From KES {product.price.toLocaleString()}
			</Typography>

			{/* Rating */}
			<Rating
				value={ratingValue}
				precision={0.5}
				readOnly
				size='medium'
				sx={{ mt: 0.5 }}
			/>

			{/* Features */}
			<Grid container spacing={1} mt={1}>
				<Grid item xs={6}>
					<Box display='flex' alignItems='center' gap={1}>
						<StairsIcon sx={{ fontSize: 22 }} color='action' />
						<Typography variant='caption'>
							{product.stories || "-"} Floor(s)
						</Typography>
					</Box>
				</Grid>

				<Grid item xs={6}>
					<Box display='flex' alignItems='center' gap={1}>
						<HotelIcon sx={{ fontSize: 22 }} color='action' />
						<Typography variant='caption'>
							{product.bedrooms || "-"} Bedroom(s)
						</Typography>
					</Box>
				</Grid>

				<Grid item xs={6}>
					<Box display='flex' alignItems='center' gap={1}>
						<BathtubIcon sx={{ fontSize: 22 }} color='action' />
						<Typography variant='caption'>
							{product.bathrooms || "-"} Bathroom(s)
						</Typography>
					</Box>
				</Grid>

				<Grid item xs={6}>
					<Box display='flex' alignItems='center' gap={1}>
						<StraightenIcon sx={{ fontSize: 22 }} color='action' />
						<Typography variant='caption'>
							{product.plot_size || "N/A"}
						</Typography>
					</Box>
				</Grid>
			</Grid>

			{/* CTA Buttons */}
			<Box display='flex' gap={1} mt={2}>
				<Button
					variant='contained'
					color='primary'
					fullWidth
					component={Link}
					to={`/product/${product.id}`}
				>
					View Details
				</Button>
				<Button
					variant='outlined'
					color='secondary'
					fullWidth
					onClick={handleAddToCart}
					disabled={product.status === "inactive"}
					startIcon={<AddShoppingCartIcon />}
				>
					Quick Buy
				</Button>
			</Box>

			{/* Plan Preview (Bottom section) */}
			{product.plan_file && (
				<Box sx={{ mt: 3 }}>
					<Typography
						variant='subtitle2'
						fontWeight={600}
						color='text.secondary'
						mb={1}
					>
						Floor Plan Overview
					</Typography>

					<Box
						sx={{
							border: "1px solid #ccc",
							borderRadius: 2,
							overflow: "hidden",
							height: 160,
							width: "100%",
						}}
					>
						{product.plan_file.endsWith(".pdf") ? (
							<iframe
								src={`${BACKEND_BASE_URL}${product.plan_file}`}
								title='Plan PDF Preview'
								style={{
									width: "100%",
									height: "100%",
									border: "none",
								}}
							/>
						) : (
							<CardMedia
								component='img'
								image={`${BACKEND_BASE_URL}${product.plan_file}`}
								alt='Plan Image Preview'
								sx={{
									height: "100%",
									width: "100%",
									objectFit: "cover",
								}}
							/>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default ProductCard;
