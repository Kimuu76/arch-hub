/** @format */

import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const BACKEND_BASE_URL = "https://arch-hub-server.onrender.com";

const HeroCarousel = ({
	featured = [],
	rate = 1,
	currency = "USD",
	HomeRef,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const intervalRef = useRef(null);
	const isHovered = useRef(false);

	const startAutoPlay = useCallback(() => {
		if (intervalRef.current) return; // avoid double intervals
		intervalRef.current = setInterval(() => {
			if (!isHovered.current) {
				setCurrentIndex((prev) => (prev + 1) % featured.length);
			}
		}, 5000);
	}, [featured.length]);

	const stopAutoPlay = useCallback(() => {
		clearInterval(intervalRef.current);
		intervalRef.current = null;
	}, []);

	useEffect(() => {
		if (featured.length > 0) {
			startAutoPlay();
		}
		return () => stopAutoPlay();
	}, [featured.length, startAutoPlay, stopAutoPlay]);

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % featured.length);
	};

	if (!featured.length) return null;

	const currentProduct = featured[currentIndex];

	return (
		<Box
			mt={2}
			onMouseEnter={() => (isHovered.current = true)}
			onMouseLeave={() => (isHovered.current = false)}
			sx={{
				position: "relative",
				minHeight: { xs: 500, md: 650 },
				width: "100%",
				mb: 6,
				overflow: "hidden",
				borderRadius: 3,
				backgroundImage: currentProduct
					? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${BACKEND_BASE_URL}${currentProduct.image})`
					: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('/hero.jpg')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				color: "#fff",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				px: 3,
				py: { xs: 6, md: 10 },
			}}
		>
			<Typography
				variant='h3'
				fontWeight={800}
				sx={{ fontFamily: "'Work Sans', sans-serif", maxWidth: 800 }}
			>
				Affordable, Ready-to-Build House Designs
			</Typography>

			<Typography
				variant='h6'
				mt={2}
				mb={3}
				sx={{ fontFamily: "'Work Sans', sans-serif", maxWidth: 600 }}
			>
				Plans for modern living – from bungalows to villas
			</Typography>

			<Button
				variant='contained'
				size='large'
				color='secondary'
				component={Link}
				to='/shop'
				sx={{ mb: 4 }}
			>
				Browse Designs
			</Button>

			{currentProduct && (
				<Box
					sx={{
						position: "absolute",
						bottom: 16,
						left: 0,
						right: 0,
						textAlign: "center",
						px: 2,
					}}
				>
					<Link
						to={`/product/${currentProduct.id}`}
						style={{
							color: "#fff",
							fontWeight: "bold",
							textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
							fontSize: "1.25rem",
						}}
					>
						{currentProduct.title} –{" "}
						{(currentProduct.price * rate).toLocaleString(undefined, {
							style: "currency",
							currency,
							minimumFractionDigits: 2,
						})}
					</Link>
				</Box>
			)}

			<IconButton
				onClick={handlePrev}
				sx={{
					position: "absolute",
					top: "50%",
					left: 20,
					transform: "translateY(-50%)",
					color: "#fff",
					bgcolor: "rgba(0,0,0,0.3)",
					"&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
				}}
			>
				<ArrowBackIos />
			</IconButton>

			<IconButton
				onClick={handleNext}
				sx={{
					position: "absolute",
					top: "50%",
					right: 20,
					transform: "translateY(-50%)",
					color: "#fff",
					bgcolor: "rgba(0,0,0,0.3)",
					"&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
				}}
			>
				<ArrowForwardIos />
			</IconButton>
		</Box>
	);
};

export default HeroCarousel;
