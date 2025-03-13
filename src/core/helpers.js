/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasString = (hs) => {
	return typeof hs === "string";
};

/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasFunction = (hs) => {
	return typeof hs === "function";
};

/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasObject = (hs) => {
	return typeof hs === "object";
};
/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasBoolean = (hs) => {
	return typeof hs === "boolean";
};
/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasNumber = (hs) => {
	return typeof hs === "number";
};
/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasNull = (hs) => {
	return hs === null;
};
/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasUndefined = (hs) => {
	return hs === undefined;
};

/**
 *
 * @param {*} hs
 * @returns {boolean}
 */
export const hasHtmlElement = (hs) => {
	return hs instanceof HTMLElement;
};
