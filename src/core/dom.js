import {
	hasFunction,
	hasHtmlElement,
	hasNull,
	hasNumber,
	hasObject,
	hasString,
} from "./helpers.js";
import { setCurrentComponent } from "./hooks.js";

/**
 *
 * @param {function} component
 * @param {HTMLElement} container
 */
const renderer = (component, container) => {
	setCurrentComponent(() => {
		stateIndex = 0; // Reset state index setiap kali render ulang
		container.innerHTML = ""; // Hapus elemen lama
		const vdom = component();
		mount(vdom, container);
	});
	container.innerHTML = "";

	setCurrentComponent(() => render(component, container));

	const vdom = component();
	mount(vdom, container);
};
/**
 *
 * @param {function} component
 * @param {HTMLElement} container
 */
export const render = (component, container) => {
	/**
	 * Validation @param component
	 */
	if (!hasFunction(component)) {
		throw new Error(
			"Invalid component provided to render. Component must be a function."
		);
	}

	/**
	 * Validation @param container
	 */

	if (!hasHtmlElement(container)) {
		throw new Error(
			"Invalid container provided to render. Container must be a valid DOM element."
		);
	}
	/**
	 * Execute DOM
	 */
	renderer(component, container);
};
/**
 *
 * @param {*} type
 * @returns {HTMLElement}
 */
const createElement = (type) => document.createElement(type);
/**
 *
 * @param {*} text
 * @returns {string}
 */
const createTextNode = (text) => document.createTextNode(String(text));
/**
 *
 * @param {object} vdom
 * @param {HTMLElement} container
 */
const mounted = (vdom, container) => {
	const dom = createElement(vdom.type);

	// Apply props
	for (const [key, value] of Object.entries(vdom.props)) {
		if (key.startsWith("on")) {
			// Tangani event (misal: onclick, oninput, dll.)
			const eventType = key.slice(2).toLowerCase(); // "onclick" -> "click"
			if (hasFunction(value)) {
				dom.addEventListener(eventType, value);
			} else {
				console.warn(`Event listener for ${key} is not a function.`);
			}
		} else if (key !== "children") {
			dom[key] = value;
		}
	}

	/**
	 * Validation @param children
	 */
	const children = Array.isArray(vdom.props.children)
		? vdom.props.children
		: [vdom.props.children];

	// Render children
	children.forEach((child) => {
		if (hasObject(child) && !hasNull(child)) {
			mount(child, dom);
		} else if (hasString(child) || hasNumber(child)) {
			dom.appendChild(createTextNode(child));
		}
	});

	container.appendChild(dom);
};

/**
 *
 * @param {object} vdom
 * @param {HTMLElement} container
 */
const mount = (vdom, container) => {
	/**
	 * Validation @param vdom
	 */
	if (!vdom || !hasObject(vdom) || !vdom.type || !vdom.props) {
		throw new Error(
			"Invalid vdom provided to mount. vdom must be an object with type and props."
		);
	}

	/**
	 * Validation @param container
	 */
	if (!hasHtmlElement(container)) {
		throw new Error(
			"Invalid container provided to render. Container must be a valid DOM element."
		);
	}

	mounted(vdom, container);
};
