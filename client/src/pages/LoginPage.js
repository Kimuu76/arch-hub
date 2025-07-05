/** @format */

import { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Container,
	InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/auth/login", { email, password });
			login(res.data.token);

			const { role } = res.data?.user || jwtDecode(res.data.token);
			role === "admin" ? navigate("/admin") : navigate("/");
		} catch (err) {
			console.error("Login error:", err);
			alert("Login failed. Please check your credentials.");
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "#f0f2f5",
			}}
		>
			<Container maxWidth='sm'>
				<Card elevation={4} sx={{ borderRadius: 3, p: 3 }}>
					<CardContent>
						<Typography
							variant='h4'
							fontWeight={700}
							align='center'
							color='primary'
							mb={1}
						>
							🏛️ ArchiPlans
						</Typography>
						<Typography variant='subtitle1' align='center' gutterBottom>
							Welcome back! Please login to your account.
						</Typography>

						<form onSubmit={handleSubmit}>
							<TextField
								label='Email'
								fullWidth
								margin='normal'
								variant='outlined'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<EmailOutlinedIcon />
										</InputAdornment>
									),
								}}
							/>
							<TextField
								label='Password'
								type='password'
								fullWidth
								margin='normal'
								variant='outlined'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<LockOutlinedIcon />
										</InputAdornment>
									),
								}}
							/>

							<Button
								type='submit'
								variant='contained'
								fullWidth
								size='large'
								sx={{ mt: 3, py: 1.5 }}
							>
								Login
							</Button>
						</form>
					</CardContent>
				</Card>

				<Typography
					variant='body2'
					align='center'
					color='text.secondary'
					sx={{ mt: 2 }}
				>
					© {new Date().getFullYear()} <strong>Developed by KevTech</strong>|
					Contact: +254712992577
				</Typography>
			</Container>
		</Box>
	);
}
