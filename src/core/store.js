import {
	hasArray,
	hasFunction,
	hasNull,
	hasObject,
	hasString,
} from "./helpers";
import { useState } from "./hooks";

/**
 * @var {object}
 */
let globalState = {};
/**
 * @var {object}
 */
let listeners = [];

/**
 *
 * @param {any} initialState
 * @return {object}
 */
export const createStore = (initialState) => {
	/**
	 *  Validasi initialState harus berupa objek
	 */
	if (
		!hasObject(initialState) ||
		hasNull(initialState) ||
		hasArray(initialState)
	) {
		throw new Error("createStore: initialState must be a plain object.");
	}

	globalState = { ...initialState };
	/**
	 *
	 * @param {object} newState
	 */
	const setState = (newState) => {
		/**
		 * Validasi newState harus berupa objek
		 */
		if (!hasObject(newState) || hasNull(newState) || hasArray(newState)) {
			throw new Error("setState: newState must be a plain object.");
		}
		/**
		 * Hindari pembaruan jika state tidak berubah
		 */
		const prevState = JSON.stringify(globalState);
		const nextState = JSON.stringify({ ...globalState, ...newState });

		if (prevState !== nextState) {
			globalState = { ...globalState, ...newState };
			listeners.forEach((listener) => listener());
		}
	};

	/**
	 *
	 * @param {string} key
	 * @returns {object}
	 */
	const getState = (key) => {
		let globals = { ...globalState };
		/**
		 * Validasi: key harus ada di state
		 */
		if (!hasString(key)) {
			throw new Error("useGlobalState: key must be a string.");
		}

		const [, setUpdate] = useState(0);

		const update = () => setUpdate((prev) => prev + 1);
		subscribe(update);

		return [globals[key], (value) => setState({ [key]: value })];
	};

	const subscribe = (callback) => {
		/**
		 * Validasi callback harus function
		 */
		if (!hasFunction(callback)) {
			throw new Error("subscribe: callback must be a function.");
		}
		listeners.push(callback);
		return () => {
			listeners = listeners.filter((listener) => listener !== callback);
		};
	};

	return {
		getState,
		setState,
		subscribe,
	};
};
