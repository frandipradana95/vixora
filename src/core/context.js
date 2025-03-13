import createElement from "./createElement";
import { hasUndefined } from "./helpers";
import { getCurrentComponent, useState, setCurrentComponent } from "./hooks";

export const createContext = (defaultValue) => {
	if (defaultValue === undefined) {
		throw new Error("createContext requires a default value.");
	}

	let contextValue = defaultValue;
	let listeners = [];
	let isProviderMounted = false;

	const Provider = ({ value, setValue, children }) => {
		if (value === undefined) {
			throw new Error("Provider must have a 'value' prop.");
		}

		contextValue = value;
		isProviderMounted = true;

		listeners.forEach((listener) => listener());

		return createElement("div", {}, ...children);
	};

	const useContext = () => {
		if (!isProviderMounted) {
			throw new Error("useContext must be used within a Provider.");
		}

		const [, setUpdate] = useState(0);
		const update = () => setUpdate((prev) => prev + 1);
		listeners.push(update);

		setCurrentComponent(() => {
			listeners = listeners.filter((listener) => listener !== update);
		});

		getCurrentComponent();

		return [
			contextValue,
			(newValue) => {
				contextValue = newValue;
				listeners.forEach((listener) => listener());
			},
		];
	};

	return { Provider, useContext };
};
