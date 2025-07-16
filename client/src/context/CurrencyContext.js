/** @format */

// context/CurrencyContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
	// Set default currency to USD
	const [currency, setCurrency] = useState("USD");

	// Conversion rate: 1 USD = 130 KES (example rate)
	const KES_RATE = 129.21;
	const [rate, setRate] = useState(1); // Base is USD

	useEffect(() => {
		if (currency === "USD") setRate(1); // no conversion
		else if (currency === "KES") setRate(KES_RATE);
	}, [currency]);

	const toggleCurrency = () => {
		setCurrency((prev) => (prev === "USD" ? "KES" : "USD"));
	};

	return (
		<CurrencyContext.Provider value={{ currency, rate, toggleCurrency }}>
			{children}
		</CurrencyContext.Provider>
	);
};

export const useCurrency = () => useContext(CurrencyContext);
