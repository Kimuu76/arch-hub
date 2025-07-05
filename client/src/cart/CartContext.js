/** @format */

import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
	switch (action.type) {
		case "ADD":
			const exists = state.items.find((item) => item.id === action.payload.id);
			if (exists) {
				return {
					...state,
					items: state.items.map((item) =>
						item.id === action.payload.id
							? { ...item, qty: item.qty + 1 }
							: item
					),
				};
			}
			return {
				...state,
				items: [...state.items, { ...action.payload, qty: 1 }],
			};

		case "REMOVE":
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload),
			};

		case "CLEAR":
			return { ...state, items: [] };

		default:
			return state;
	}
};

const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, { items: [] });

	const addToCart = (product) => dispatch({ type: "ADD", payload: product });
	const removeFromCart = (id) => dispatch({ type: "REMOVE", payload: id });
	const clearCart = () => dispatch({ type: "CLEAR" });

	const total = state.items.reduce(
		(acc, item) => acc + item.price * item.qty,
		0
	);

	return (
		<CartContext.Provider
			value={{ cart: state.items, addToCart, removeFromCart, clearCart, total }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
