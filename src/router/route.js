import createElement from "../core/createElement";

const Route = ({ path, component }) => {
	return createElement("div", { path }, createElement(component));
};

export default Route;
