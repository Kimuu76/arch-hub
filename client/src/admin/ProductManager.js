/** @format */

import React, { useEffect, useMemo, useState } from "react";
import {
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	IconButton,
	Stack,
	TextField,
	TablePagination,
	Paper,
	Tooltip,
	Box,
	Switch,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { Delete, Edit, PictureAsPdf } from "@mui/icons-material";
import axios from "../api/axios";
import AddProductForm from "./AddProductForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import AdminHeader from "../components/AdminHeader";

const ProductManager = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [open, setOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	// Pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, []);

	const fetchProducts = async () => {
		const res = await axios.get("/products");
		setProducts(res.data);
	};

	const fetchCategories = async () => {
		const res = await axios.get("/categories");
		setCategories(res.data);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			await axios.delete(`/products/${id}`);
			setProducts((prev) => prev.filter((p) => p.id !== id));
		}
	};

	const handleToggleStatus = async (product) => {
		const updatedStatus = product.status === "active" ? "inactive" : "active";
		const res = await axios.patch(`/products/${product.id}/toggle-status`, {
			status: updatedStatus,
		});
		setProducts((prev) =>
			prev.map((p) => (p.id === product.id ? res.data : p))
		);
	};

	const handleProductSaved = (savedProduct) => {
		setProducts((prev) =>
			prev.some((p) => p.id === savedProduct.id)
				? prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
				: [savedProduct, ...prev]
		);
		setEditingProduct(null);
		setOpen(false);
	};

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Filtering logic
	const filteredProducts = useMemo(() => {
		return products
			.filter((p) => p.title?.toLowerCase().includes(searchTerm.toLowerCase()))
			.filter((p) =>
				selectedCategory === "all" ? true : p.category_id === selectedCategory
			);
	}, [products, searchTerm, selectedCategory]);

	const paginatedProducts = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredProducts.slice(start, start + rowsPerPage);
	}, [filteredProducts, page, rowsPerPage]);

	// Export handlers
	const handleExportPDF = () => {
		const doc = new jsPDF();
		doc.text("Product List", 14, 10);
		autoTable(doc, {
			startY: 20,
			head: [["Title", "Price", "Category", "Status"]],
			body: filteredProducts.map((p) => [
				p.title,
				`$ ${p.price}`,
				p.category_name,
				p.status ?? "active",
			]),
		});
		doc.save("products.pdf");
	};

	const handleExportExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			filteredProducts.map((p) => ({
				Title: p.title,
				Price: p.price,
				Category: p.category_name,
				Status: p.status ?? "active",
			}))
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
		XLSX.writeFile(workbook, "products.xlsx");
	};

	return (
		<Box>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent='space-between'
				alignItems={{ xs: "stretch", sm: "center" }}
				spacing={2}
				mb={2}
			>
				<AdminHeader title='Manage Products' emoji='🛒' />
				<Stack direction='row' spacing={1}>
					<Button variant='contained' onClick={() => setOpen(true)}>
						Add Product
					</Button>
					<Button
						variant='outlined'
						color='secondary'
						startIcon={<PictureAsPdf />}
						onClick={handleExportPDF}
					>
						Export PDF
					</Button>
					<Button
						variant='outlined'
						color='primary'
						onClick={handleExportExcel}
					>
						Export Excel
					</Button>
				</Stack>
			</Stack>

			<AddProductForm
				open={open}
				onClose={() => {
					setOpen(false);
					setEditingProduct(null);
				}}
				onProductSaved={handleProductSaved}
				initialData={editingProduct}
			/>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={2}
				mb={2}
				component={Paper}
				sx={{ p: 2 }}
			>
				<TextField
					label='Search Products'
					variant='outlined'
					fullWidth
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<FormControl fullWidth>
					<InputLabel>Filter by Category</InputLabel>
					<Select
						value={selectedCategory}
						label='Filter by Category'
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						<MenuItem value='all'>All</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>

			<Paper>
				{filteredProducts.length > 0 ? (
					<>
						<Table>
							<TableHead>
								<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
									<TableCell>Image</TableCell>
									<TableCell>Plan File</TableCell>
									<TableCell>Title</TableCell>
									<TableCell>Price</TableCell>
									<TableCell>Category</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedProducts.map((product) => (
									<TableRow key={product.id}>
										<TableCell>
											<img
												src={`https://arch-hub-server.onrender.com${product.image}`}
												alt={product.title}
												width={60}
												style={{ borderRadius: 4 }}
											/>
										</TableCell>
										<TableCell>
											{product.plan_file ? (
												<a
													href={`https://arch-hub-server.onrender.com${product.plan_file}`}
													target='_blank'
													rel='noreferrer'
												>
													View
												</a>
											) : (
												<span style={{ color: "#888" }}>No file</span>
											)}
										</TableCell>
										<TableCell>{product.title}</TableCell>
										<TableCell>$ {product.price}</TableCell>
										<TableCell>{product.category_name}</TableCell>
										<TableCell>
											<Switch
												checked={(product.status ?? "active") === "active"}
												onChange={() => handleToggleStatus(product)}
												color='primary'
											/>
										</TableCell>
										<TableCell>
											<Tooltip title='Edit'>
												<IconButton
													onClick={() => {
														setEditingProduct(product);
														setOpen(true);
													}}
												>
													<Edit />
												</IconButton>
											</Tooltip>
											<Tooltip title='Delete'>
												<IconButton onClick={() => handleDelete(product.id)}>
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
							count={filteredProducts.length}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							rowsPerPageOptions={[5, 10, 25]}
						/>
					</>
				) : (
					<Typography p={2} textAlign='center' color='text.secondary'>
						No products found.
					</Typography>
				)}
			</Paper>
		</Box>
	);
};

export default ProductManager;

/** @format 

import React, { useEffect, useMemo, useState } from "react";
import {
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	IconButton,
	Stack,
	TextField,
	TablePagination,
	Paper,
	Tooltip,
	Box,
	Switch,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { Delete, Edit, PictureAsPdf } from "@mui/icons-material";
import axios from "../api/axios";
import AddProductForm from "./AddProductForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ProductManager = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [open, setOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	// Pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, []);

	const fetchProducts = async () => {
		const res = await axios.get("/products");
		setProducts(res.data);
	};

	const fetchCategories = async () => {
		const res = await axios.get("/categories");
		setCategories(res.data);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			await axios.delete(`/products/${id}`);
			setProducts((prev) => prev.filter((p) => p.id !== id));
		}
	};

	const handleToggleStatus = async (product) => {
		const updatedStatus = product.status === "active" ? "inactive" : "active";
		const updatedProduct = { ...product, status: updatedStatus };
		await axios.put(`/products/${product.id}`, updatedProduct);
		setProducts((prev) =>
			prev.map((p) => (p.id === product.id ? updatedProduct : p))
		);
	};

	const handleProductSaved = (savedProduct) => {
		setProducts((prev) =>
			prev.some((p) => p.id === savedProduct.id)
				? prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
				: [savedProduct, ...prev]
		);
		setEditingProduct(null);
		setOpen(false);
	};

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Filter logic
	const filteredProducts = useMemo(() => {
		return products
			.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
			.filter((p) =>
				selectedCategory === "all" ? true : p.category_id === selectedCategory
			);
	}, [products, searchTerm, selectedCategory]);

	const paginatedProducts = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredProducts.slice(start, start + rowsPerPage);
	}, [filteredProducts, page, rowsPerPage]);

	// PDF Export
	const handleExportPDF = () => {
		const doc = new jsPDF();
		doc.text("Product List", 14, 10);
		autoTable(doc, {
			startY: 20,
			head: [["Title", "Price", "Category", "Status"]],
			body: filteredProducts.map((p) => [
				p.title,
				`KES ${p.price}`,
				p.category_name,
				p.status ?? "active",
			]),
		});
		doc.save("products.pdf");
	};

	//excel export
	const handleExportExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			filteredProducts.map((p) => ({
				Title: p.title,
				Price: p.price,
				Category: p.category_name,
				Status: p.status ?? "active",
			}))
		);

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

		XLSX.writeFile(workbook, "products.xlsx");
	};

	return (
		<Box>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent='space-between'
				alignItems={{ xs: "stretch", sm: "center" }}
				spacing={2}
				mb={2}
			>
				<Typography variant='h5'>Manage Products</Typography>
				<Stack direction='row' spacing={1}>
					<Button variant='contained' onClick={() => setOpen(true)}>
						Add Product
					</Button>
					<Button
						variant='outlined'
						color='secondary'
						startIcon={<PictureAsPdf />}
						onClick={handleExportPDF}
					>
						Export PDF
					</Button>
					<Button
						variant='outlined'
						color='primary'
						onClick={handleExportExcel}
					>
						Export Excel
					</Button>
				</Stack>
			</Stack>

			<AddProductForm
				open={open}
				onClose={() => {
					setOpen(false);
					setEditingProduct(null);
				}}
				onProductSaved={handleProductSaved}
				initialData={editingProduct}
			/>

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={2}
				mb={2}
				component={Paper}
				sx={{ p: 2 }}
			>
				<TextField
					label='Search Products'
					variant='outlined'
					fullWidth
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<FormControl fullWidth>
					<InputLabel>Filter by Category</InputLabel>
					<Select
						value={selectedCategory}
						label='Filter by Category'
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						<MenuItem value='all'>All</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>

			<Paper>
				{filteredProducts.length > 0 ? (
					<>
						<Table>
							<TableHead>
								<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
									<TableCell>Image</TableCell>
									<TableCell>Plan File</TableCell>
									<TableCell>Title</TableCell>
									<TableCell>Price</TableCell>
									<TableCell>Category</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedProducts.map((product) => (
									<TableRow key={product.id}>
										<TableCell>
											<img
												src={`http://localhost:5000${product.image}`}
												alt={product.title}
												width={60}
												style={{ borderRadius: 4 }}
											/>
										</TableCell>
										<TableCell>
											{product.plan_file ? (
												<a
													href={`http://localhost:5000${product.plan_file}`}
													target='_blank'
													rel='noreferrer'
												>
													View
												</a>
											) : (
												<span style={{ color: "#888" }}>No file</span>
											)}
										</TableCell>
										<TableCell>{product.title}</TableCell>
										<TableCell>KES {product.price}</TableCell>
										<TableCell>{product.category_name}</TableCell>
										<TableCell>
											<Switch
												checked={(product.status ?? "active") === "active"}
												onChange={() => handleToggleStatus(product)}
												color='primary'
											/>
										</TableCell>
										<TableCell>
											<Tooltip title='Edit'>
												<IconButton
													onClick={() => {
														setEditingProduct(product);
														setOpen(true);
													}}
												>
													<Edit />
												</IconButton>
											</Tooltip>
											<Tooltip title='Delete'>
												<IconButton onClick={() => handleDelete(product.id)}>
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
							count={filteredProducts.length}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							rowsPerPageOptions={[5, 10, 25]}
						/>
					</>
				) : (
					<Typography p={2} textAlign='center' color='text.secondary'>
						No products found.
					</Typography>
				)}
			</Paper>
		</Box>
	);
};

export default ProductManager;*/
