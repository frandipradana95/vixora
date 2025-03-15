import createElement from "./core/createElement";
import { render } from "./core/dom";
import { useState, useFlow, onMount } from "./core/hooks";
import { createStore } from "./core/store";
export * from "./core/helpers";

const Vixora = {
	createElement,
	render,
	useFlow,
	useState,
	onMount,
	createStore,
};

export { createElement, render, useFlow, useState, onMount, createStore };

export default Vixora;
