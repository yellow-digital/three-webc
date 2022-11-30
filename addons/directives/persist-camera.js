import { ThreeWebc } from "three-webc/index.js";

export const REFRESH_RATE = 1000
export const precision = 5;
export const delimiter = "_";

function debounce(func, timeout = 1000) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

function throttle (callback, limit = 1000) {
    var waiting = false;                      // Initially, we're not waiting
    return function () {                      // We return a throttled function
        if (!waiting) {                       // If we're not waiting
            callback.apply(this, arguments);  // Execute users function
            waiting = true;                   // Prevent future invocations
            setTimeout(function () {          // After a period of time
                waiting = false;              // And allow future invocations
            }, limit);
        }
    }
}

function encodeVector(vector = {}) {
	const { x, y, z } = vector;
	return `${x.toFixed(precision)}${delimiter}${y.toFixed(
		precision
	)}${delimiter}${z.toFixed(precision)}`;
}
function decodeVector(value = "") {
	const [x, y, z] = value.split(delimiter);
	return { x: Number(x), y: Number(y), z: Number(z) };
}

const updateQueryParams = (vector = {}, target = {}) => {
	const data = {
		pos: encodeVector(vector),
		target: encodeVector(target),
	};

	const searchParams = new URLSearchParams(data);

	history.replaceState(null, null, `#${searchParams.toString()}`);
};

const onChange = throttle((control) => {
	// object holds the ref to the camera
	updateQueryParams(control.object.position, control.target);
}, REFRESH_RATE);

const getParams = () => {
	const iterator = new URLSearchParams(
		location.hash.replace("#", "")
	).entries();
	const params = Object.fromEntries(iterator);
	return params;
};

const handler = ({ controls }) => {
	if (!controls) {
		throw new Error("please provide controls");
	}

	controls.addEventListener(
		"change",
		(e) => {
			onChange(e.target);
		},
		false
	);
};

const install = (el, { value }) => {
	const controls = el.$root.controls;

	// Set initial
	const params = getParams();
	const data = {
		pos: decodeVector(params.pos),
		target: decodeVector(params.target),
	};
	console.log(params, data)
	if (params.pos) {
		const v = data.pos;
		controls.object.position.set(v.x, v.y, v.z);
	}
	if (params.target) {
		const v = data.target;
		controls.target.set(v.x, v.y, v.z);
	}
	// Listen
	handler({ controls });
};

ThreeWebc.directive("persist-camera", install);
