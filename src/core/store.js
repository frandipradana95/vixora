let globalState = {};
let listeners = [];

export const createStore = (initialState) => {
	globalState = { ...initialState };
	const setState = (newState) => {
		globalState = { ...globalState, ...newState };
		listeners.forEach((listener) => listener());
	};

	const getState = () => globalState;

	const subscribe = (callback) => {
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
