import createElement from "../core/createElement";
import { useState } from "../core/hooks";

const Router = ({ children }) => {
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	/**
	 * Untuk menangani perubahan URL
	 */
	const routeChange = () => {
		setCurrentPath(window.location.pathname);
	};

	/**
	 * Tambahkan event saat url berubah
	 */
	window.addEventListener("popstate", routeChange);

	/**
	 * Cari route yang cocok
	 */
	let active = null;
	children.forEach((route) => {
		if (route.props.path === currentPath) {
			active = route.props.children[0];
		}
	});

	return (
		active ||
		createElement(
			"span",
			{
				style: "color:red",
			},
			"404 Not Found"
		)
	);
};

export default Router;
