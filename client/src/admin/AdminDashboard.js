/** @format */

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
	Box,
	AppBar,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	Typography,
	IconButton,
	Button,
	CssBaseline,
	ListItemIcon,
	Card,
	CardContent,
	Grid,
} from "@mui/material";
import axios from "../api/axios";
import AddCategoryForm from "./AddCategoryForm";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";

const drawerWidth = 240;

const AdminDashboard = () => {
	const [openCatDialog, setOpenCatDialog] = useState(false);
	const navigate = useNavigate();
	const location = useLocation(); // 🧭 Track current path

	const [stats, setStats] = useState({
		products: 0,
		categories: 0,
		purchases: 0,
		revenue: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await axios.get("/admin/stats");
				setStats(res.data);
			} catch (err) {
				console.error("Failed to load stats", err);
			}
		};
		fetchStats();
	}, []);

	const handleCategoryCreated = (category) => {
		console.log("Category created:", category);
	};

	const menuItems = [
		{ label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
		{ label: "Products", icon: <InventoryIcon />, path: "/admin/products" },
		{ label: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
		{ label: "Purchases", icon: <ReceiptIcon />, path: "/admin/purchases" },
	];

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />

			{/* Sidebar */}
			<Drawer
				variant='permanent'
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box",
						bgcolor: "#f9f9f9",
						borderRight: "1px solid #ddd",
					},
				}}
			>
				<Toolbar>
					<Typography variant='h6' fontWeight='bold'>
						Admin Panel
					</Typography>
				</Toolbar>

				<List>
					{menuItems.map((item) => (
						<ListItem
							button
							key={item.label}
							onClick={() => navigate(item.path)}
							sx={{
								bgcolor:
									location.pathname === item.path ? "#e0f2f1" : "transparent",
								borderLeft:
									location.pathname === item.path ? "4px solid #1976d2" : "",
								"&:hover": {
									bgcolor: "#e3f2fd",
								},
							}}
						>
							<ListItemIcon sx={{ color: "#1976d2" }}>{item.icon}</ListItemIcon>
							<ListItemText
								primary={item.label}
								primaryTypographyProps={{
									fontWeight:
										location.pathname === item.path ? "bold" : "normal",
								}}
							/>
						</ListItem>
					))}

					<ListItem
						button
						onClick={() => {
							alert("Logging out...");
							navigate("/");
						}}
					>
						<ListItemIcon>
							<LogoutIcon color='error' />
						</ListItemIcon>
						<ListItemText primary='Logout' />
					</ListItem>
				</List>

				{/*<Box sx={{ p: 2, mt: "auto" }}>
					<Button
						variant='contained'
						fullWidth
						onClick={() => setOpenCatDialog(true)}
					>
						+ Create Category
					</Button>
				</Box>*/}
			</Drawer>

			{/* Main content */}
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Toolbar />
				<Outlet />
			</Box>

			<AddCategoryForm
				open={openCatDialog}
				onClose={() => setOpenCatDialog(false)}
				onCategoryCreated={handleCategoryCreated}
			/>
		</Box>
	);
};

export default AdminDashboard;
