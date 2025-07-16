/** @format */

import { useLocation, useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Typography,
	Grid,
	Paper,
	Alert,
	Stack,
	Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";

const SuccessPage = () => {
	const { state } = useLocation();
	const navigate = useNavigate();

	const downloads = state?.downloads || [];

	if (downloads.length === 0) {
		return (
			<Box
				sx={{
					p: 4,
					minHeight: "60vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Alert
					severity='warning'
					variant='outlined'
					action={
						<Button color='inherit' onClick={() => navigate("/")}>
							Go Home
						</Button>
					}
				>
					No downloadable items were found in your purchase.
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
			{/* Success banner */}
			<Fade in timeout={500}>
				<Box
					sx={{
						bgcolor: "success.light",
						color: "success.contrastText",
						p: 3,
						borderRadius: 3,
						display: "flex",
						alignItems: "center",
						mb: 5,
						boxShadow: 3,
					}}
				>
					<CheckCircleIcon sx={{ fontSize: 40, mr: 2 }} />
					<Box>
						<Typography variant='h5' fontWeight={700}>
							Purchase Successful!
						</Typography>
						<Typography variant='body1'>
							Thank you for your purchase. Your plans are ready to download.
						</Typography>
					</Box>
				</Box>
			</Fade>

			{/* Downloads Grid */}
			<Grid container spacing={3}>
				{downloads.map((item) => (
					<Grid item xs={12} sm={6} md={4} key={item.id}>
						<Fade in timeout={300}>
							<Paper
								elevation={3}
								sx={{
									p: 3,
									height: "100%",
									borderRadius: 3,
									transition: "0.3s",
									"&:hover": { boxShadow: 6 },
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
								}}
							>
								<Box mb={2}>
									<Typography fontWeight={600} variant='h6' gutterBottom>
										{item.title}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										High-quality architectural plan in downloadable format.
									</Typography>
								</Box>
								<Button
									fullWidth
									variant='contained'
									color='primary'
									href={`https://arch-hub-server.onrender.com/api/products/${item.id}/download?token=${item.token}`}
									download
								>
									Download Plan
								</Button>
							</Paper>
						</Fade>
					</Grid>
				))}
			</Grid>

			{/* Return Home */}
			<Stack direction='row' justifyContent='center' sx={{ mt: 6 }}>
				<Button
					onClick={() => navigate("/")}
					variant='outlined'
					startIcon={<HomeIcon />}
					size='large'
				>
					Return to Homepage
				</Button>
			</Stack>
		</Box>
	);
};

export default SuccessPage;
