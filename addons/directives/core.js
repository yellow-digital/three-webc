import { ThreeWebc } from "three-webc/index.js";

ThreeWebc.directive("interval", (el, {value}) => {
	const fn = ThreeWebc.createFunction(value);
	setInterval(() => {
		fn.apply(el);
	}, 1000);
});

ThreeWebc.directive(":timeout", (el, {value}) => {
	const fn = ThreeWebc.createFunction(value, el);
	setTimeout(() => {
		fn();
	}, 1000);
});

ThreeWebc.directive( "@tick", (el, {value}) => {
	const fn = ThreeWebc.createFunction(value, el);
	// Mutate ThreeWebc.Element tick function
	el.tick = () => {
		fn();
	};
});

ThreeWebc.directive("@mounted", (el, {value}) => {
	el.addEventListener('ready', e => {
		const fn = ThreeWebc.createFunction(value, el);
		fn()
	})
});
