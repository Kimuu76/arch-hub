/** @format */

// pages/ProductDetail.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);

	useEffect(() => {
		axios.get(`/products/${id}`).then((res) => setProduct(res.data));
	}, [id]);

	if (!product) return <Typography>Loading...</Typography>;

	return (
		<Box sx={{ p: 4 }}>
			<img
				src={`https://arch-hub-server.onrender.com${product.image}`}
				alt={product.title}
				style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}
			/>
			<Typography variant='h4' gutterBottom>
				{product.title}
			</Typography>
			<Typography variant='h6' color='primary'>
				${product.price}
			</Typography>
			<Typography variant='body1' sx={{ mt: 2 }}>
				{product.description}
			</Typography>

			<Button variant='contained' sx={{ mt: 3 }}>
				Buy Plan
			</Button>
		</Box>
	);
}

export default ProductDetail;
