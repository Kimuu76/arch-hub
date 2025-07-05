/** @format */

import { useAuth } from "../auth/AuthContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	return (
		<>
			{user ? (
				<Button
					color='inherit'
					onClick={() => {
						logout();
						navigate("/login");
					}}
				>
					Logout
				</Button>
			) : (
				<Button color='inherit' onClick={() => navigate("/login")}>
					Login
				</Button>
			)}
		</>
	);
};
