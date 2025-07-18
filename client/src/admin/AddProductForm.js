/** @format */

import React, { useState, useEffect } from "react";
import {
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Stack,
	CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "../api/axios";

const AddProductForm = ({ open, onClose, onProductSaved, initialData }) => {
	const [form, setForm] = useState({
		title: "",
		price: "",
		short_description: "",
		description: "",
		category_id: "",
		images: null,
		plan_file: null,
		bedrooms: "",
		bathrooms: "",
		stories: "",
		plot_size: "",
		roof_type: "",
		style: "",
	});

	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (initialData) {
			setForm({
				...initialData,
				image: null,
				plan_file: null,
			});
		}
	}, [initialData]);

	useEffect(() => {
		axios.get("/categories").then((res) => setCategories(res.data));
	}, []);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "images") {
			setForm((prev) => ({
				...prev,
				images: files,
			}));
		} else {
			setForm((prev) => ({
				...prev,
				[name]: files ? files[0] : value,
			}));
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		const data = new FormData();

		for (const key in form) {
			if (key === "images" && form.images) {
				for (let i = 0; i < form.images.length; i++) {
					data.append("images", form.images[i]);
				}
			} else if (form[key]) {
				data.append(key, form[key]);
			}
		}

		try {
			const url = initialData ? `/products/${initialData.id}` : "/products";
			const method = initialData ? "put" : "post";

			const res = await axios({
				url,
				method,
				data,
				headers: { "Content-Type": "multipart/form-data" },
			});

			toast.success(
				`Product ${initialData ? "updated" : "saved"} successfully`
			);
			onProductSaved(res.data);
			onClose();
		} catch (err) {
			console.error("Product save failed", err);
			toast.error("Failed to save product. Please try again.");
		}
		setLoading(false);
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>
				{initialData ? "Edit Product" : "Add New Product"}
			</DialogTitle>
			<DialogContent>
				<Stack spacing={2} mt={1}>
					<TextField
						label='Title'
						name='title'
						value={form.name}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Short Description'
						name='short_description'
						value={form.short_description}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Price'
						name='price'
						type='number'
						value={form.price}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Description'
						name='description'
						value={form.description}
						onChange={handleChange}
						fullWidth
						multiline
						rows={3}
					/>
					<TextField
						select
						label='Category'
						name='category_id'
						value={form.category_id}
						onChange={handleChange}
						fullWidth
					>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label='Bedrooms'
						name='bedrooms'
						type='number'
						value={form.bedrooms}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Bathrooms'
						name='bathrooms'
						type='number'
						value={form.bathrooms}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Stories'
						name='stories'
						type='number'
						value={form.stories}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Plot Size'
						name='plot_size'
						value={form.plot_size}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Roof Type'
						name='roof_type'
						value={form.roof_type}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						label='Style'
						name='style'
						value={form.style}
						onChange={handleChange}
						fullWidth
					/>

					<Button variant='outlined' component='label'>
						Upload Images (multiple)
						<input
							type='file'
							name='images'
							multiple
							hidden
							accept='image/*'
							onChange={handleChange}
						/>
					</Button>

					<Button variant='outlined' component='label'>
						Upload Plan File
						<input
							type='file'
							name='plan_file'
							hidden
							accept='.pdf,.zip,.dwg'
							onChange={handleChange}
						/>
					</Button>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{loading
						? initialData
							? "Updating..."
							: "Saving..."
						: initialData
						? "Update"
						: "Save"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddProductForm;
