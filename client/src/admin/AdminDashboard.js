/** @format */

import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import AddCategoryForm from "./AddCategoryForm";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const AdminDashboard = () => {
	const [openCatDialog, setOpenCatDialog] = useState(false);
	const navigate = useNavigate();

	const handleCategoryCreated = (category) => {
		console.log("Category created:", category);
	};

	const handleNavigate = (path) => {
		navigate(path);
	};

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
						bgcolor: "background.paper",
					},
				}}
			>
				<Toolbar>
					<Typography variant='h6'>Admin Panel</Typography>
				</Toolbar>

				<List>
					<ListItem button onClick={() => handleNavigate("/admin/products")}>
						<InventoryIcon sx={{ mr: 1 }} />
						<ListItemText primary='Products' />
					</ListItem>
					<ListItem button onClick={() => handleNavigate("/admin/categories")}>
						<CategoryIcon sx={{ mr: 1 }} />
						<ListItemText primary='Categories' />
					</ListItem>
					<ListItem
						button
						onClick={() => handleNavigate("/") > alert("Logging out...")}
					>
						<LogoutIcon sx={{ mr: 1 }} />
						<ListItemText primary='Logout' />
					</ListItem>
				</List>

				<Box sx={{ p: 2 }}>
					<Button
						variant='contained'
						fullWidth
						onClick={() => setOpenCatDialog(true)}
					>
						+ Create Category
					</Button>
				</Box>
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
