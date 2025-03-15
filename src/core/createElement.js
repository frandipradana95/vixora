import {
	hasBoolean,
	hasFunction,
	hasNull,
	hasNumber,
	hasObject,
	hasString,
	hasUndefined,
} from "./helpers";

/**
 *
 * @param {string && object} type
 * @param {null && object} props
 * @param  {...string && object && array || []} children
 * @returns {object}
 */
const createElement = (type, props = {}, ...children) => {
	/**
	 * Validation @param
	 */
	if (!hasString(type) && !hasFunction(type) && !hasObject(type)) {
		throw new Error(
			`Invalid type provided to createElement. Must be a string, function, try checking your code again`
		);
	}

	/**
	 * Validation @param props
	 */
	if (!hasNull(props) && !hasObject(props)) {
		throw new Error(
			`Invalid props provided to createElement. Props must be an object or null. try checking your code again`
		);
	}
	props = safeProps(props);
	children = validationChildren(children);

	if (hasFunction(type)) {
		return type({
			...props,
			children,
		});
	}
	return {
		type,
		props: {
			...props,
			children,
		},
	};
};

const safeProps = (props) => {
	const safe = Object.create(null);
	for (let key in props) {
		safe[key] = props[key];
	}

	return safe;
};

/**
 * check children to be valid for execution
 * @param {string, number, object, or array} children
 */
const validationChildren = (children) => {
	children = children
		.flat()
		.filter(
			(child) => !hasNull(child) && !hasUndefined(child) && !hasBoolean(child)
		);

	children = children.map((child) => {
		if (
			hasString(child) ||
			hasNumber(child) ||
			(hasObject(child) && !hasNull(child))
		) {
			return child; // Valid: string, number, atau object
		}
		throw new Error(
			"Invalid child type. Children must be a string, number, object, or array. try checking your code again"
		);
	});

	return children;
};

export default createElement;
