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
let updateTimeout;

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
	} else {
		updateElement(container, newVDOM, previousVDOM);
	}

	previousVDOM = newVDOM;
	setCurrentComponent(component);
};

/**
 *
 * @returns {null/void}
 */
export const setUpdate = () => {
	if (!rootContainer || !previousVDOM || !hasFunction(currentComponent)) {
		console.warn(
			"setUpdate() gagal: rootContainer, previousVDOM, atau currentComponent tidak valid."
		);
		return;
	}

	// Pastikan rootContainer masih ada di DOM sebelum update
	if (!document.body.contains(rootContainer)) {
		console.warn(
			"setUpdate() gagal: rootContainer sudah tidak ada di dalam DOM."
		);
		return;
	}

	// Hindari terlalu banyak update dalam waktu singkat (debounce)
	clearTimeout(updateTimeout);
	updateTimeout = setTimeout(() => {
		try {
			const newVDOM = currentComponent(); // Buat Virtual DOM baru
			if (!newVDOM) {
				console.warn("setUpdate() gagal: newVDOM tidak valid.");
				return;
			}

			updateElement(rootContainer, newVDOM, previousVDOM); // Hanya update perubahan
			previousVDOM = newVDOM; // Simpan VDOM terbaru
		} catch (error) {
			console.error("Terjadi kesalahan saat setUpdate():", error);
		}
	}, 0);
};

/**
 *
 * @param {function} component
 *
 */
export const setCurrentComponent = (component) => {
	if (!hasFunction(component)) {
		throw new Error("Invalid component: must be a function.");
	}
	currentComponent = component;
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
	// container.innerHTML = "";
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

/**
 *
 * @param {object} vnode
 * @returns {HTMLElement}
 */
const createElementUpdate = (vnode) => {
	if (hasString(vnode) || hasNumber(vnode)) {
		return document.createTextNode(String(vnode));
	}

	// Pastikan vnode memiliki type yang valid
	if (!vnode.type || !hasString(vnode.type)) {
		console.warn("Invalid vnode type:", vnode);
		return document.createComment("Invalid vnode type"); // Gantikan dengan komentar
	}

	const element = document.createElement(vnode.type); // Fix: Gunakan `type` bukan `tag`

	if (vnode.props && hasObject(vnode.props)) {
		Object.entries(vnode.props).forEach(([key, value]) => {
			if (key.startsWith("on") && hasFunction(value)) {
				const eventType = key.slice(2).toLowerCase();
				element.addEventListener(eventType, value);
			} else if (key === "children") {
				// Jangan set properti `children` secara langsung
				return;
			} else if (key in element) {
				element[key] = value;
			} else {
				console.warn(`Unknown property "${key}" on element <${vnode.type}>`);
			}
		});
	}

	(vnode.props.children || []).forEach((child) =>
		element.appendChild(createElementUpdate(child))
	);

	return element;
};

/**
 *
 * @param {HTMLElement} parent
 * @param {object} newVNode
 * @param {object} oldVNode
 * @param {number} index
 * @returns {void}
 */
export const updateElement = (parent, newVNode, oldVNode, index = 0) => {
	// Validasi parent harus berupa elemen HTML
	if (!hasHtmlElement(parent)) {
		console.error("updateElement: Parent bukan elemen HTML yang valid", parent);
		return;
	}
	if (!changed(newVNode, oldVNode)) return;

	if (!oldVNode) {
		parent.appendChild(createElementUpdate(newVNode));
	} else if (!newVNode) {
		if (parent.childNodes[index]) {
			parent.removeChild(parent.childNodes[index]);
		}
	} else if (changed(oldVNode, newVNode)) {
		if (hasString(oldVNode) && hasString(newVNode)) {
			// Jika hanya teks yang berubah, cukup update teksnya tanpa replace elemen
			parent.childNodes[index].nodeValue = newVNode;
		} else if (parent.childNodes[index]) {
			parent.replaceChild(
				createElementUpdate(newVNode),
				parent.childNodes[index]
			);
		} else {
			parent.appendChild(createElementUpdate(newVNode));
		}
	} else if (newVNode.type) {
		const maxChildren = Math.max(
			(oldVNode.props.children || []).length,
			(newVNode.props.children || []).length
		);

		for (let i = 0; i < maxChildren; i++) {
			updateElement(
				parent.childNodes[index] || parent, // Fix: Hindari `undefined`
				newVNode.props.children?.[i],
				oldVNode.props.children?.[i],
				i
			);
		}
	}
};
/**
 *
 * @param {object} node1
 * @param {object} node2
 * @returns {boolean}
 */
function changed(node1, node2) {
	// Jika salah satu node null atau undefined, dianggap berubah
	if (node1 == null || node2 == null) return true;

	// Jika tipe data berbeda, jelas berubah
	if (typeof node1 !== typeof node2) return true;

	// Jika tipe data string atau number, bandingkan secara langsung
	if (typeof node1 === "string" || typeof node1 === "number") {
		return node1 !== node2;
	}

	// Pastikan kedua node adalah objek dengan properti type dan props
	if (
		typeof node1 !== "object" ||
		typeof node2 !== "object" ||
		!node1.type ||
		!node2.type
	) {
		throw new Error("Invalid Virtual DOM structure detected.");
	}

	// Jika tipe elemen berbeda, berarti berubah
	if (node1.type !== node2.type) return true;

	// Cek perubahan props (tanpa JSON.stringify)
	const oldProps = node1.props || {};
	const newProps = node2.props || {};
	const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

	for (let key of allKeys) {
		if (oldProps[key] !== newProps[key]) return true;
	}

	return false;
}
