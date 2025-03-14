import createElement from "./core/createElement";
import { render } from "./core/dom";
import { onMount, useFlow, useGlobalState, useState } from "./core/hooks";
import { createStore } from "./core/store";
import Router from "./router";
import Link from "./router/Link";
import Route from "./router/route";
const store = createStore({ count: 0 });

const Counter = () => {
	const [count, setCount] = store.getState("count");

	onMount(() => {
		fetch("https://jsonplaceholder.typicode.com/posts")
			.then((response) => response.json())
			.then((json) => console.log(json));
	});

	return createElement(
		"div",
		null,
		createElement("h1", null, "Haloo"),
		createElement("p", null, `count : ${count}`),
		createElement("button", { onClick: () => setCount(count + 1) }, "tambah"),
		createElement("br"),
		createElement(Link, { path: "/" }, "Kembali ke Home")
	);
};

const Home = () => {
	return createElement(
		"div",
		{},
		createElement("h1", null, "Home Component"),
		createElement(Link, { path: "/counter" }, "Pergi ke Counter")
	);
};

const App = () => {
	return createElement(
		Router,
		null,
		createElement(Route, { path: "/", component: Home }),
		createElement(Route, { path: "/counter", component: Counter })
	);
};

render(() => createElement(App), document.getElementById("root"));
