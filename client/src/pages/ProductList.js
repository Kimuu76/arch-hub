/** @format */

// pages/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

function ProductList() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios.get("/products").then((res) => setProducts(res.data));
	}, []);

	return (
		<Grid container spacing={3} sx={{ p: 3 }}>
			{products.map((product) => (
				<Grid item xs={12} sm={6} md={4} key={product.id}>
					<Link
						to={`/products/${product.id}`}
						style={{ textDecoration: "none" }}
					>
						<Card>
							<CardMedia
								component='img'
								height='200'
								image={`https://arch-hub-server.onrender.com${product.image}`}
								alt={product.title}
							/>
							<CardContent>
								<Typography variant='h6'>{product.title}</Typography>
								<Typography variant='body2'>${product.price}</Typography>
							</CardContent>
						</Card>
					</Link>
				</Grid>
			))}
		</Grid>
	);
}

export default ProductList;
