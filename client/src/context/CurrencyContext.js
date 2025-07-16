/** @format */

// context/CurrencyContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
	const [currency, setCurrency] = useState("KES");
	const [rate, setRate] = useState(1); // 1 KES = 1 KES
	const USD_RATE = 0.0077; // e.g. 1 KES = 0.0077 USD

	useEffect(() => {
		// In a real app, fetch from an API or backend
		if (currency === "USD") setRate(USD_RATE);
		else setRate(1);
	}, [currency]);

	const toggleCurrency = () => {
		setCurrency((prev) => (prev === "KES" ? "USD" : "KES"));
	};

	return (
		<CurrencyContext.Provider value={{ currency, rate, toggleCurrency }}>
			{children}
		</CurrencyContext.Provider>
	);
};

export const useCurrency = () => useContext(CurrencyContext);
