/** @format */

import React, { useEffect, useState, useMemo } from "react";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	CircularProgress,
	Button,
	Stack,
	Pagination,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import axios from "../api/axios";

const DashboardSummary = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
	const [toDate, setToDate] = useState(dayjs());

	const [page, setPage] = useState(1);
	const itemsPerPage = 5;

	const fetchStats = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/admin/stats", {
				params: {
					from: fromDate.format("YYYY-MM-DD"),
					to: toDate.format("YYYY-MM-DD"),
				},
			});
			setStats(res.data);
			setPage(1); // Reset page on new fetch
		} catch (err) {
			console.error("❌ Failed to load stats", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStats();
	}, [fromDate, toDate]);

	const exportPDF = () => {
		const doc = new jsPDF();
		doc.text("Dashboard Summary", 14, 10);
		autoTable(doc, {
			head: [["Metric", "Value"]],
			body: [
				["Products", stats.products],
				["Categories", stats.categories],
				["Purchases", stats.purchases],
				["Revenue", `KES ${Number(stats.revenue).toLocaleString()}`],
			],
		});
		doc.save("dashboard_summary.pdf");
	};

	const exportExcel = () => {
		const ws = XLSX.utils.json_to_sheet([
			{ Metric: "Products", Value: stats.products },
			{ Metric: "Categories", Value: stats.categories },
			{ Metric: "Purchases", Value: stats.purchases },
			{ Metric: "Revenue", Value: stats.revenue },
		]);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Summary");
		XLSX.writeFile(wb, "dashboard_summary.xlsx");
	};

	const paginatedProducts = useMemo(() => {
		if (!stats?.topProducts) return [];
		const start = (page - 1) * itemsPerPage;
		return stats.topProducts.slice(start, start + itemsPerPage);
	}, [stats, page]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box>
				<Typography variant='h4' gutterBottom fontWeight={600}>
					📊 Admin Dashboard Summary
				</Typography>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					my={3}
					alignItems='center'
				>
					<DatePicker
						label='From'
						value={fromDate}
						onChange={setFromDate}
						format='YYYY-MM-DD'
					/>
					<DatePicker
						label='To'
						value={toDate}
						onChange={setToDate}
						format='YYYY-MM-DD'
					/>
					<Button variant='contained' color='primary' onClick={fetchStats}>
						Apply Filter
					</Button>
					<Button variant='outlined' onClick={exportPDF}>
						Export PDF
					</Button>
					<Button variant='outlined' onClick={exportExcel}>
						Export Excel
					</Button>
				</Stack>

				{loading || !stats ? (
					<Box textAlign='center' mt={4}>
						<CircularProgress />
					</Box>
				) : (
					<>
						{/* Summary Cards */}
						<Grid container spacing={3} sx={{ mb: 4 }}>
							{["Products", "Categories", "Purchases", "Revenue"].map(
								(label, i) => (
									<Grid item xs={12} md={3} key={i}>
										<Card sx={{ bgcolor: "#f5f5f5" }}>
											<CardContent>
												<Typography variant='subtitle2'>{label}</Typography>
												<Typography variant='h5'>
													{label === "Revenue"
														? `KES ${Number(stats.revenue).toLocaleString()}`
														: stats[label.toLowerCase()]}
												</Typography>
											</CardContent>
										</Card>
									</Grid>
								)
							)}
						</Grid>

						{/* Revenue Line Chart */}
						<Typography variant='h6' sx={{ mb: 1 }}>
							💹 Revenue Over Time
						</Typography>
						<Box height={300} mb={4}>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={stats.dailyRevenue || []}>
									<XAxis dataKey='date' />
									<YAxis />
									<CartesianGrid stroke='#ccc' />
									<Tooltip />
									<Line
										type='monotone'
										dataKey='amount'
										stroke='#1976d2'
										strokeWidth={2}
									/>
								</LineChart>
							</ResponsiveContainer>
						</Box>

						{/* Top Products with Pagination */}
						<Typography variant='h6' sx={{ mb: 1 }}>
							🏅 Top Selling Products
						</Typography>

						{paginatedProducts.length > 0 ? (
							<>
								{paginatedProducts.map((p, i) => (
									<Card key={i} sx={{ mb: 1 }}>
										<CardContent
											sx={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Typography>{p.title}</Typography>
											<Typography>Sold: {p.count}</Typography>
										</CardContent>
									</Card>
								))}
								<Box display='flex' justifyContent='center' mt={2}>
									<Pagination
										count={Math.ceil(stats.topProducts.length / itemsPerPage)}
										page={page}
										onChange={(e, val) => setPage(val)}
										color='primary'
									/>
								</Box>
							</>
						) : (
							<Typography color='text.secondary'>No sales yet.</Typography>
						)}
					</>
				)}
			</Box>
		</LocalizationProvider>
	);
};

export default DashboardSummary;
