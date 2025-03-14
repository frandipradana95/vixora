import createElement from "../core/createElement";

/**
 *
 * @param {string} path
 * @param {object} children
 * @return {HTMLAnchorElement}
 */
const Link = ({ path, children }) => {
	return createElement(
		"a",
		{
			href: String(path),
			onClick: (e) => {
				e.preventDefault();
				window.history.pushState({}, "", path);
				window.dispatchEvent(new Event("popstate"));
			},
		},
		children
	);
};

export default Link;
