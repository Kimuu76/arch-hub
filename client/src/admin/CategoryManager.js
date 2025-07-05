/** @format */

import React, { useEffect, useState, useMemo } from "react";
import {
	Box,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Button,
	TextField,
	IconButton,
	Stack,
	Paper,
	Tooltip,
	TablePagination,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "../api/axios";

function CategoryManager() {
	const [categories, setCategories] = useState([]);
	const [newName, setNewName] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	// Pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const res = await axios.get("/categories");
		setCategories(res.data);
	};

	const handleAddOrUpdate = async () => {
		if (!newName.trim()) {
			setError("Category name cannot be empty.");
			return;
		}
		setError("");

		if (editingId) {
			await axios.put(`/categories/${editingId}`, { name: newName });
		} else {
			await axios.post("/categories", { name: newName });
		}

		setNewName("");
		setEditingId(null);
		fetchCategories();
	};

	const handleEdit = (cat) => {
		setNewName(cat.name);
		setEditingId(cat.id);
		setError("");
	};

	const handleCancelEdit = () => {
		setNewName("");
		setEditingId(null);
		setError("");
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			await axios.delete(`/categories/${id}`);
			fetchCategories();
		}
	};

	// Pagination & Search Logic
	const filteredCategories = useMemo(() => {
		return categories.filter((cat) =>
			cat.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [categories, searchTerm]);

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const paginatedData = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredCategories.slice(start, start + rowsPerPage);
	}, [filteredCategories, page, rowsPerPage]);

	return (
		<Box>
			<Paper sx={{ p: 3, mb: 3 }}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
					<TextField
						label='Category Name'
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						error={!!error}
						helperText={error}
						fullWidth
					/>
					<Button
						variant='contained'
						color='primary'
						onClick={handleAddOrUpdate}
					>
						{editingId ? "Update Category" : "Add Category"}
					</Button>
					{editingId && (
						<Button variant='outlined' onClick={handleCancelEdit}>
							Cancel
						</Button>
					)}
				</Stack>

				<TextField
					label='Search Categories'
					variant='outlined'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					fullWidth
				/>
			</Paper>

			<Paper elevation={2}>
				{filteredCategories.length > 0 ? (
					<>
						<Table>
							<TableHead>
								<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
									<TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedData.map((cat) => (
									<TableRow key={cat.id}>
										<TableCell>{cat.name}</TableCell>
										<TableCell>
											<Tooltip title='Edit'>
												<IconButton onClick={() => handleEdit(cat)}>
													<Edit />
												</IconButton>
											</Tooltip>
											<Tooltip title='Delete'>
												<IconButton onClick={() => handleDelete(cat.id)}>
													<Delete />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<TablePagination
							component='div'
							count={filteredCategories.length}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							rowsPerPageOptions={[5, 10, 25]}
						/>
					</>
				) : (
					<Typography p={2} textAlign='center' color='text.secondary'>
						No categories found.
					</Typography>
				)}
			</Paper>
		</Box>
	);
}

export default CategoryManager;
