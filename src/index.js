import createElement from "./core/createElement";
import { render } from "./core/dom";
import { useFlow, useGlobalState, useState } from "./core/hooks";
import { createStore } from "./core/store";
const store = createStore({ count: 0 });

const App = () => {
	const [count, setCount] = store.getState("count");

	useFlow(() => {
		fetch("https://jsonplaceholder.typicode.com/posts")
			.then((response) => response.json())
			.then((json) => console.log(json));
	}, []);

	return createElement(
		"div",
		null,
		createElement("h1", null, "Haloo"),
		createElement("p", null, `count : ${count}`),
		createElement("button", { onClick: () => setCount(count + 1) }, "tambah")
	);
};

render(() => createElement(App), document.getElementById("root"));
