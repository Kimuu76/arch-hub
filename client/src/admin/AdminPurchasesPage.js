/** @format */

import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	CircularProgress,
} from "@mui/material";
import axios from "../api/axios";
import AdminHeader from "../components/AdminHeader";

const AdminPurchasesPage = () => {
	const [purchases, setPurchases] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get("/admin/purchases");
				setPurchases(res.data);
			} catch (err) {
				console.error("Failed to load purchases", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<Box sx={{ px: 4, py: 4 }}>
			<AdminHeader title='Purchase Records' emoji='🧾' />

			{loading ? (
				<CircularProgress />
			) : (
				<Paper elevation={3} sx={{ overflow: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Product ID</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Amount</TableCell>
								<TableCell>M-Pesa Code</TableCell>
								<TableCell>Token</TableCell>
								<TableCell>Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{purchases.map((p) => (
								<TableRow key={p.id}>
									<TableCell>{p.id}</TableCell>
									<TableCell>{p.product_id}</TableCell>
									<TableCell>{p.phone}</TableCell>
									<TableCell>KES {p.amount}</TableCell>
									<TableCell>{p.external_id}</TableCell>
									<TableCell style={{ fontSize: "0.75rem" }}>
										{p.download_token}
									</TableCell>
									<TableCell>
										{new Date(p.created_at).toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			)}
		</Box>
	);
};

export default AdminPurchasesPage;
