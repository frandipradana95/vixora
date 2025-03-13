import createElement from "./core/createElement";
import { render } from "./core/dom";
import { useState } from "./core/hooks";

const App = () => {
	const [count, setCount] = useState(0);
	return createElement(
		"div",
		null,
		createElement("h1", null, "test state"),
		createElement("p", null, `Count: ${count}`),
		createElement("button", { onClick: () => setCount(count + 1) }, "Tambahkan")
	);
};

render(() => createElement(App), document.getElementById("root"));
