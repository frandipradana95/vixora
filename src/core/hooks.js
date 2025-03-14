import { setUpdate } from "./dom";
import { hasArray, hasNumber, hasUndefined } from "./helpers";

/**
 * @var {object}
 */
let states = [];
/**
 * @var {boolean}
 */
let stateIndex = 0;
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
