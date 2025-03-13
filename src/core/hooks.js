import { setUpdate } from "./dom";
import {
	hasArray,
	hasFunction,
	hasNumber,
	hasString,
	hasUndefined,
} from "./helpers";

let states = [];
let stateIndex = 0;
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
		// currentComponent();
		setUpdate();
		stateIndex = 0;
		// setCurrentComponent(() => currentComponent());
		// currentComponent(); // Re-render komponen
	};

	const value = states[currentIndex]; // Ambil nilai langsung
	stateIndex++; // Pindah ke state berikutnya
	return [value, setState]; // Kembalikan nilai langsung, bukan fungsi
};

/**
 *
 * @param {*} store
 * @param {*} key
 * @returns {[]}
 */
export const useGlobalState = (store, key) => {
	/**
	 * Validasi: key harus berupa string
	 */
	if (
		!store ||
		!hasFunction(store.getState) ||
		!hasFunction(store.setState) ||
		!hasFunction(store.subscribe)
	) {
		throw new Error("useGlobalState: store must be a valid store instance.");
	}
	/**
	 * Validasi: key harus ada di state
	 */
	if (!hasString(key)) {
		throw new Error("useGlobalState: key must be a string.");
	}
	const [, setUpdate] = useState(0);
	const update = () => setUpdate((prev) => prev + 1);
	// Subscribe ke perubahan state
	const unsubscribe = store.subscribe(update);
	// setCurrentComponent(() => unsubscribe());

	return [store.getState()[key], (value) => store.setState({ [key]: value })];
};
