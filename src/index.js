import createElement from "./core/createElement";
import { render } from "./core/dom";

const App = () => {
	return createElement("div", null, createElement("h1", null, "hallo"));
};

render(() => createElement(App), document.getElementById("root"));
