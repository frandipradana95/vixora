import { hasArray, hasFunction, hasNull, hasObject } from "./helpers";

let globalState = {};
let listeners = [];

/**
 *
 * @param {any} initialState
 * @returns {object}
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

	// const getState = () => globalState;
	const getState = () => ({ ...globalState });

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
