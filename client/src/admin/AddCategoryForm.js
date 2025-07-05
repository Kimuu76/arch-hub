/** @format */

// src/admin/AddCategoryForm.js
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from "@mui/material";
import { useState } from "react";
import axios from "../api/axios";

const AddCategoryForm = ({ open, onClose, onCategoryCreated }) => {
	const [name, setName] = useState("");

	const handleSubmit = async () => {
		try {
			const res = await axios.post("/categories", { name });
			onCategoryCreated(res.data); // send new category to parent
			setName("");
			onClose();
		} catch (err) {
			console.error("Error creating category:", err);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>Create Category</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					label='Category Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant='contained' onClick={handleSubmit}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddCategoryForm;
