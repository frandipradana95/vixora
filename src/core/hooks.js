import { hasArray, hasFunction, hasNumber, hasUndefined } from "./helpers";

let states = [];
let stateIndex = 0;
let currentComponent = null;

/**
 *
 * @param {any} initialValue
 * @returns {[]}
 */
export const useState = (initialValue) => {
	/**
	 * simpan index saat ini
	 */
	const currentIndex = stateIndex;
	/**
	 * pastikan states adalah array
	 */
	if (!hasArray(states)) {
		throw new Error("Internal error: 'states' must be an array.");
	}
	/**
	 * Gunakan nilai lama jika sudah ada, jika tidak gunakan initialValue
	 */
	if (hasUndefined(states[currentIndex])) {
		states[currentIndex] = initialValue;
	}

	const setState = (newValue) => {
		if (!hasNumber(currentIndex)) {
			throw new Error("Internal error: Invalid state index.");
		}
		/**
		 * Cegah pembaruan jika nilai yang diberikan sama dengan nilai saat ini
		 */
		if (Object.is(states[currentIndex], newValue)) return;

		states[currentIndex] = newValue;
		getCurrentComponent();
		// stateIndex = 0; // Reset index sebelum render ulang

		// setCurrentComponent(() => currentComponent());
		// currentComponent(); // Re-render komponen
	};

	const value = states[currentIndex]; // Ambil nilai langsung
	stateIndex++; // Pindah ke state berikutnya

	return [value, setState]; // Kembalikan nilai langsung, bukan fungsi
};

/**
 * execute currentComponent agar hot reload
 */
const getCurrentComponent = () => {
	stateIndex = 0;
	currentComponent();
};

/**
 *
 * @param {function} component
 */
export const setCurrentComponent = (component) => {
	if (!hasFunction(component)) {
		throw new Error("Invalid component: must be a function.");
	}
	currentComponent = component;
	stateIndex = 0;
};

/**
 *
 * @param {*} store
 * @param {*} key
 * @returns
 */
export const useGlobalState = (store, key) => {
	const [, setUpdate] = makeState(0);
	const update = () => setUpdate((prev) => prev + 1);
	store.subscribe(update);
	return [store.getState()[key], (value) => store.setState({ [key]: value })];
};
