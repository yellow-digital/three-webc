import { ThreeWebc } from "three-webc/index.js";

ThreeWebc.directive((el) => {
	const name = "interval"
	if (!el.getAttribute(name)) {
		return;
	}

	const fn = ThreeWebc.createFunction(el.getAttribute(name));
	setInterval(() => {
		fn.apply(el);
	}, 1000);
});

ThreeWebc.directive((el) => {
	const name = ":timeout"
	if (!el.getAttribute(name)) {
		return;
	}

	const fn = ThreeWebc.createFunction(el.getAttribute(name), el);
	setTimeout(() => {
		fn();
	}, 1000);
});

ThreeWebc.directive((el) => {
	const name = "@tick"
	if (!el.getAttribute(name)) {
		return;
	}

	const fn = ThreeWebc.createFunction(el.getAttribute(name), el);
	// Mutate ThreeWebc.Element tick function
	el.tick = () => {
		fn();
	};
});

ThreeWebc.directive((el) => {
	const name = "@mounted"
	if (!el.getAttribute(name)) {
		return;
	}

	el.addEventListener('ready', e => {
		const fn = ThreeWebc.createFunction(el.getAttribute(name), el);
		fn()
	})
});
