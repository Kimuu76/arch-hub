/** @format */

import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ children, role }) {
	const { user } = useAuth();
	if (!user) return <Navigate to='/login' />;
	if (role && user.role !== role) return <Navigate to='/' />;
	return children;
}
