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
} from "@mui/material";
import axios from "../api/axios";

const AddProductForm = ({ open, onClose, onProductSaved, initialData }) => {
	const [form, setForm] = useState({
		title: "",
		price: "",
		short_description: "",
		description: "",
		category_id: "",
		image: null,
		plan_file: null,
		bedrooms: "",
		bathrooms: "",
		stories: "",
		plot_size: "",
		roof_type: "",
		style: "",
	});

	const [categories, setCategories] = useState([]);

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
		setForm((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));
	};

	const handleSubmit = async () => {
		const data = new FormData();
		for (const key in form) {
			if (form[key]) data.append(key, form[key]);
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

			onProductSaved(res.data);
			onClose();
		} catch (err) {
			console.error("Product save failed", err);
		}
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

					{/* Specifications */}
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
						Upload Image
						<input
							type='file'
							name='image'
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
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant='contained'>
					{initialData ? "Update" : "Save"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddProductForm;
