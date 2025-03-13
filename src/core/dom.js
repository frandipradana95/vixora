import { setCurrentComponent } from "./hooks.js";

/**
 *
 * @param {*} component
 * @param {*} container
 */
export const render = (component, container) => {
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
 * @param {*} type
 * @returns
 */
const createElement = (type) => document.createElement(type);
/**
 *
 * @param {*} text
 * @returns
 */
const createTextNode = (text) => document.createTextNode(text);
/**
 *
 * @param {*} vdom
 * @param {*} container
 */
const mount = (vdom, container) => {
	const dom = createElement(vdom.type);

	// Apply props
	for (const [key, value] of Object.entries(vdom.props)) {
		if (key.startsWith("on")) {
			// Tangani event (misal: onclick, oninput, dll.)
			const eventType = key.slice(2).toLowerCase(); // "onclick" -> "click"
			dom.addEventListener(eventType, value);
		} else if (key !== "children") {
			dom[key] = value;
		}
	}

	// Render children
	vdom.props.children.forEach((child) => {
		if (typeof child === "object") {
			mount(child, dom);
		} else if (typeof child === "string") {
			dom.appendChild(createTextNode(child));
		}
	});

	container.appendChild(dom);
};
