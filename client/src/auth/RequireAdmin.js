/** @format 

// src/auth/RequireAdmin.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAdmin = ({ children }) => {
	const { user } = useAuth();

	if (!user || user.role !== "admin") return <Navigate to='/' />;
	return children;
};

export default RequireAdmin;*/

// src/auth/RequireAdmin.js
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
	const { user } = useAuth();

	if (!user) return <Navigate to='/login' />;
	if (user.role !== "admin") return <Navigate to='/' />;

	return children;
}
