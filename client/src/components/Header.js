/** @format */

import { useCart } from "../pages/CartContext"; // adjust path as needed
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const Header = () => {
	const { cart } = useCart();
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<nav>
			{/* other nav items */}
			<IconButton component={Link} to='/cart'>
				<Badge badgeContent={totalItems} color='secondary'>
					<ShoppingCartIcon />
				</Badge>
			</IconButton>
		</nav>
	);
};

export default Header;
