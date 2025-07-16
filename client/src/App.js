/** @format */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";

import AdminDashboard from "./admin/AdminDashboard";
import DashboardSummary from "./admin/DashboardSummary";
import ProductManager from "./admin/ProductManager";
import CategoryManager from "./admin/CategoryManager";
import AdminPurchasesPage from "./admin/AdminPurchasesPage";

import { AuthProvider } from "./auth/AuthContext";
import RequireAdmin from "./auth/RequireAdmin";

import { CartProvider } from "./pages/CartContext";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import { CurrencyProvider } from "./context/CurrencyContext";

export default function App() {
	return (
		<CurrencyProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<CartProvider>
					<AuthProvider>
						<Router>
							<ToastContainer position='top-right' autoClose={3000} />
							<Routes>
								{/* Public Routes */}
								<Route path='/' element={<HomePage />} />
								<Route path='/login' element={<LoginPage />} />
								<Route path='/shop' element={<ProductList />} />
								<Route path='/products/:id' element={<ProductDetail />} />
								<Route path='/product/:id' element={<ProductDetailPage />} />
								<Route path='/cart' element={<CartPage />} />
								<Route path='/checkout' element={<CheckoutPage />} />
								<Route path='/success' element={<SuccessPage />} />

								{/* Admin Routes */}
								<Route
									path='/admin'
									element={
										<RequireAdmin>
											<AdminDashboard />
										</RequireAdmin>
									}
								>
									<Route index element={<ProductManager />} />
									<Route path='dashboard' element={<DashboardSummary />} />
									<Route path='products' element={<ProductManager />} />
									<Route path='categories' element={<CategoryManager />} />
									<Route path='purchases' element={<AdminPurchasesPage />} />
								</Route>
							</Routes>
						</Router>
					</AuthProvider>
				</CartProvider>
			</ThemeProvider>
		</CurrencyProvider>
	);
}
