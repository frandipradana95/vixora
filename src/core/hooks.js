let states = [];
let stateIndex = 0;
let currentComponent = null;

/**
 *
 * @param {*} initialValue
 * @returns
 */
export const makeState = (initialValue) => {
	const currentIndex = stateIndex; // Simpan indeks saat ini

	// Gunakan nilai lama jika sudah ada, jika tidak gunakan initialValue
	if (states[currentIndex] === undefined) {
		states[currentIndex] = initialValue;
	}

	const setState = (newValue) => {
		states[currentIndex] = newValue;
		stateIndex = 0; // Reset index sebelum render ulang
		currentComponent(); // Re-render komponen
	};

	const value = states[currentIndex]; // Ambil nilai langsung
	stateIndex++; // Pindah ke state berikutnya

	return [value, setState]; // Kembalikan nilai langsung, bukan fungsi
};
/**
 *
 * @param {*} component
 */
export const setCurrentComponent = (component) => {
	currentComponent = component;
};

export const getGlobalState = (store, key) => {
	const [, setUpdate] = makeState(0);
	const update = () => setUpdate((prev) => prev + 1);
	store.subscribe(update);
	return [store.getState()[key], (value) => store.setState({ [key]: value })];
};
