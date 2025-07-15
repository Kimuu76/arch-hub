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
	Button,
	Chip,
	Stack,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	TablePagination,
} from "@mui/material";
import axios from "../api/axios";
import AdminHeader from "../components/AdminHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { toast } from "react-toastify";

const AdminPurchasesPage = () => {
	const [purchases, setPurchases] = useState([]);
	const [loading, setLoading] = useState(true);
	const [processingId, setProcessingId] = useState(null);
	const [filter, setFilter] = useState("all");

	// Pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Reject Dialog
	const [rejectDialog, setRejectDialog] = useState({
		open: false,
		purchaseId: null,
		reason: "",
	});

	const fetchPurchases = async () => {
		try {
			const res = await axios.get("/admin/purchases");
			setPurchases(res.data);
		} catch (err) {
			console.error("Failed to load purchases", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPurchases();
	}, []);

	const handleApprove = async (id) => {
		setProcessingId(id);
		try {
			await axios.put(`/admin/purchases/${id}/approve`);
			toast.success("✅ Purchase approved!");
			setPurchases((prev) =>
				prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
			);
		} catch {
			toast.error("❌ Approval failed");
		} finally {
			setProcessingId(null);
		}
	};

	const handleReject = async () => {
		const { purchaseId, reason } = rejectDialog;
		if (!reason.trim()) {
			toast.error("⚠️ Please provide a rejection reason.");
			return;
		}
		setProcessingId(purchaseId);
		try {
			await axios.put(`/admin/purchases/${purchaseId}/reject`, { reason });
			toast.info("Purchase rejected");
			setPurchases((prev) =>
				prev.map((p) =>
					p.id === purchaseId
						? { ...p, status: "rejected", rejection_reason: reason }
						: p
				)
			);
			setRejectDialog({ open: false, purchaseId: null, reason: "" });
		} catch {
			toast.error("❌ Rejection failed");
		} finally {
			setProcessingId(null);
		}
	};

	const renderStatusChip = (status) => {
		switch (status) {
			case "approved":
				return (
					<Chip icon={<CheckCircleIcon />} label='Approved' color='success' />
				);
			case "rejected":
				return <Chip icon={<CancelIcon />} label='Rejected' color='error' />;
			default:
				return (
					<Chip
						icon={<HourglassEmptyIcon />}
						label='Pending'
						color='warning'
						variant='outlined'
					/>
				);
		}
	};

	const filteredPurchases =
		filter === "all" ? purchases : purchases.filter((p) => p.status === filter);

	const paginated = filteredPurchases.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<Box sx={{ px: 4, py: 4 }}>
			<AdminHeader title='Purchase Records' emoji='🧾' />

			{/* Filter */}
			<Stack direction='row' spacing={2} alignItems='center' mb={2}>
				<Typography>Status:</Typography>
				<Select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					size='small'
				>
					<MenuItem value='all'>All</MenuItem>
					<MenuItem value='pending'>Pending</MenuItem>
					<MenuItem value='approved'>Approved</MenuItem>
					<MenuItem value='rejected'>Rejected</MenuItem>
				</Select>
			</Stack>

			{loading ? (
				<CircularProgress />
			) : (
				<Paper elevation={3} sx={{ overflow: "auto" }}>
					<Table>
						<TableHead sx={{ bgcolor: "#f5f5f5" }}>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Product ID</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Amount</TableCell>
								<TableCell>M-Pesa Code</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Token</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginated.map((p) => (
								<TableRow key={p.id}>
									<TableCell>{p.id}</TableCell>
									<TableCell>{p.product_id}</TableCell>
									<TableCell>{p.phone}</TableCell>
									<TableCell>KES {p.amount}</TableCell>
									<TableCell>{p.external_id}</TableCell>
									<TableCell>{renderStatusChip(p.status)}</TableCell>
									<TableCell style={{ fontSize: "0.75rem" }}>
										{p.download_token}
									</TableCell>
									<TableCell>
										{new Date(p.created_at).toLocaleString()}
									</TableCell>
									<TableCell>
										<Stack direction='row' spacing={1}>
											{p.status === "pending" && (
												<>
													<Button
														variant='contained'
														color='success'
														size='small'
														disabled={processingId === p.id}
														onClick={() => handleApprove(p.id)}
													>
														Approve
													</Button>
													<Button
														variant='outlined'
														color='error'
														size='small'
														disabled={processingId === p.id}
														onClick={() =>
															setRejectDialog({
																open: true,
																purchaseId: p.id,
																reason: "",
															})
														}
													>
														Reject
													</Button>
												</>
											)}
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<TablePagination
						component='div'
						count={filteredPurchases.length}
						page={page}
						onPageChange={(_, newPage) => setPage(newPage)}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={(e) => {
							setRowsPerPage(parseInt(e.target.value, 10));
							setPage(0);
						}}
					/>
				</Paper>
			)}

			{/* Reject Dialog */}
			<Dialog
				open={rejectDialog.open}
				onClose={() => setRejectDialog({ ...rejectDialog, open: false })}
			>
				<DialogTitle>Reject Purchase</DialogTitle>
				<DialogContent>
					<TextField
						label='Reason for rejection'
						fullWidth
						multiline
						minRows={3}
						value={rejectDialog.reason}
						onChange={(e) =>
							setRejectDialog({ ...rejectDialog, reason: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() =>
							setRejectDialog({ open: false, purchaseId: null, reason: "" })
						}
					>
						Cancel
					</Button>
					<Button variant='contained' color='error' onClick={handleReject}>
						Reject
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AdminPurchasesPage;
