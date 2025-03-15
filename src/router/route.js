import createElement from "../core/createElement";
import { hasFunction, hasString } from "../core/helpers";

/**
 *
 * @param {string} path
 * @param {object} component
 * @return {HTMLDivElement}
 */
export const Route = ({ path, component }) => {
	if (!hasString(path)) {
		throw new Error("path must be filled with string");
	}

	if (!hasFunction(component)) {
		throw new Error("component must be filled with function");
	}
	return createElement("div", { path }, createElement(component));
};
