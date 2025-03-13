import createElement from "./core/createElement";

const Test = () => createElement("h1", {}, "test");

const App = createElement(
	createElement(Test),
	{},
	createElement("h1", {}, "Haloooo")
);

console.log(App);
