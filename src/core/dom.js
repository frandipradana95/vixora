import {
	hasFunction,
	hasHtmlElement,
	hasNull,
	hasNumber,
	hasObject,
	hasString,
} from "./helpers.js";
let previousVDOM = null;
let rootContainer = null;
let currentComponent = null;

/**
 *
 * @param {function} component
 * @param {HTMLElement} container
 */
const renderer = (component, container) => {
	const newVDOM = component();
	if (!previousVDOM) {
		mount(newVDOM, container);
		rootContainer = container;
		previousVDOM = newVDOM;
	} else {
		updateElement(container, previousVDOM, newVDOM);
	}
	setCurrentComponent(() => render(component, container));
};

export const setUpdate = () => {
	if (currentComponent) {
		currentComponent();
	}
};

/**
 *
 * @param {function} component
 */
export const setCurrentComponent = (component) => {
	if (!hasFunction(component)) {
		throw new Error("Invalid component: must be a function.");
	}
	if (!currentComponent) {
		currentComponent = component;
	} else {
		previousVDOM = currentComponent;
		currentComponent = component;
	}
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
	container.innerHTML = "";
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
export const mount = (vdom, container) => {
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

//////////

export const updateElement = (parent, o, n, index = 0) => {
	const exnode = parent.childNodes;
	console.log(exnode);

	if (!o) {
		parent.appendChild(createElement(n));
	} else if (!n) {
		if (exnode) parent.removeChild(exnode);
	} else if (hasDifferentNode(o, n)) {
		try {
			parent.replaceChild(createElement(n), exnode);
		} catch (error) {
			parent.replaceChild(createTextNode(n), exnode);
		}
	} else if (hasObject(n) && n.type) {
		// if (exnode) updateAttributes(exnode, o, n);
		const oldChildren = o.props?.children || [];
		const newChildren = n.props?.children || [];
		const maxLength = Math.max(oldChildren.length, newChildren.length);
		for (let i = 0; i < maxLength; i++) {
			updateElement(parent, oldChildren[i], newChildren[i], i);
		}
	}

	// mount(o, parent);
};

const hasDifferentNode = (oldVDOM, newVDOM) => {
	return (
		typeof oldVDOM !== typeof newVDOM ||
		(typeof oldVDOM === "string" && oldVDOM !== newVDOM) ||
		oldVDOM.type !== newVDOM.type
	);
};

const updateAttributes = (node, oldProps = {}, newProps = {}) => {
	for (let name in oldProps) {
		if (!(name in newProps)) {
			node.removeAttribute(name);
		}
	}
	for (let name in newProps) {
		if (oldProps[name] !== newProps[name]) {
			if (typeof newProps[name] === "boolean") {
				if (newProps[name]) {
					node.setAttribute(name, "");
				} else {
					node.removeAttribute(name);
				}
			} else {
				node.setAttribute(name, newProps[name]);
			}
		}
	}
};
