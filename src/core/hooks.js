import { getCurrentComponent, setCurrentComponent, setUpdate } from "./dom";
import { hasArray, hasFunction, hasNumber, hasUndefined } from "./helpers";

/**
 * @var {object}
 */
let states = [];
/**
 * @var {boolean}
 */
let stateIndex = 0;

const lifecycleMap = new Map();
const lifecycleCleanup = new Map();

/**
 *
 * @param {any} initialValue
 * @return {object}
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

	/**
	 *
	 * function untuk membuat / menset state global
	 * @function setState
	 * @param {*} newValue
	 *
	 */
	const setState = (newValue) => {
		/**
		 * Validasi jika bukan type number
		 * dan kembalikan error
		 * @var currentIndex
		 * @throw
		 */
		if (!hasNumber(currentIndex)) {
			throw new Error("Internal error: Invalid state index.");
		}
		/**
		 *
		 * Cegah pembaruan jika nilai yang diberikan sama dengan nilai saat ini
		 * @return
		 */
		if (Object.is(states[currentIndex], newValue)) return;

		states[currentIndex] = newValue;
		/**
		 * @function setUpdate  update element dengan element baru
		 */
		setUpdate();
		/**
		 * @var stateIndex reset index jado 0
		 */
		stateIndex = 0;
	};

	/**
	 *
	 * @var value Ambil nilai langsung dan masukkan dalam
	 * @var stateIndex Pindah ke state berikutnya
	 * @return {object} Kembalikan nilai langsung, bukan fungsi
	 */
	const value = states[currentIndex];
	stateIndex++;
	return [value, setState];
};

export const useFlow = (callback, dependencies) => {
	const component = getCurrentComponent();
	if (!component) {
		throw new Error("useFlow harus dipanggil di dalam fungsi komponen!");
	}

	if (lifecycleMap.has(component)) {
		lifecycleMap.set(component, []);
		lifecycleCleanup.set(component, []);
	}
	const prevDeps = lifecycleMap.get(component);
	/**
	 * cek apakah dependencies berubah
	 */
	const hasChanged =
		!prevDeps || dependencies.some((dep, i) => dep !== prevDeps[i]);

	if (hasChanged) {
		/**
		 * Jalankan clean up
		 */
		const cleanup = lifecycleCleanup.get(component);
		if (hasFunction(cleanup)) {
			cleanup();
		}

		/**
		 * simpan clean up ke fuction
		 */
		const newCleanup = callback();
		if (hasFunction(newCleanup)) {
			lifecycleCleanup.set(component, newCleanup);
		} else {
			lifecycleCleanup.set(component, null);
		}

		lifecycleMap.set(component, dependencies);
	}
};

export const triggerCleanupFlow = (component) => {
	const lifecycles = lifecycleMap.get(component);
	if (lifecycles) {
		lifecycles.forEach((e) => {
			e.cleanup && e.cleanup();
			lifecycleMap.delete(component);
		});
	}
};
