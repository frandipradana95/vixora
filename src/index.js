import createElement from "./core/createElement";
import { render } from "./core/dom";
import { useState, useFlow, onMount } from "./core/hooks";
import { createStore } from "./core/store";
import Router, { Link, Route } from "./router";
export * from "./core/helpers";

const Vixora = {
	createElement,
	render,
	useFlow,
	useState,
	onMount,
	createStore,
	Router,
	Route,
	Link,
};

export {
	createElement,
	render,
	useFlow,
	useState,
	onMount,
	createStore,
	Router,
	Route,
	Link,
};

export default Vixora;
