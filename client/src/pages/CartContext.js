/** @format */

// CartContext.js
import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "ADD_ITEM": {
			const existing = state.find((item) => item.id === payload.id);
			if (existing) {
				return state.map((item) =>
					item.id === payload.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...state, { ...payload, quantity: 1 }];
		}

		case "REMOVE_ITEM":
			return state.filter((item) => item.id !== payload);

		case "CLEAR_CART":
			return [];

		case "INCREASE_QUANTITY":
			return state.map((item) =>
				item.id === payload ? { ...item, quantity: item.quantity + 1 } : item
			);

		case "DECREASE_QUANTITY":
			return state.map((item) =>
				item.id === payload && item.quantity > 1
					? { ...item, quantity: item.quantity - 1 }
					: item
			);

		default:
			return state;
	}
};

export const CartProvider = ({ children }) => {
	const [cart, dispatch] = useReducer(cartReducer, []);
	return (
		<CartContext.Provider value={{ cart, dispatch }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
