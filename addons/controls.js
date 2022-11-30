import { ThreeWebc } from "three-webc";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const resolvers = {
	OrbitControls: (view) => {
		const controls = new OrbitControls(view.camera, view.renderer.domElement);
		return controls;
	},
	FirstPersonControls: (view) => {
		const controls = new FirstPersonControls(
			view.camera,
			view.renderer.domElement
		);
		return controls;
	},
	ArcballControls: (view) => {
		const controls = new ArcballControls(
			view.camera,
			view.renderer.domElement,
			view.scene
		);
		return controls;
	},
	FlyControls: (view) => {
		const controls = new FlyControls(view.camera, view.renderer.domElement);
		return controls;
	},
};

export const TYPES = [
	"Arcball",
	"Drag",
	"FirstPerson",
	"Fly",
	"Orbit",
	"PointerLock",
	"Trackball",
	"Transform",
];

class Controls extends ThreeWebc.Element {
	constructor() {
		super();
		this.object = {};
		this.TYPES = TYPES;
		this.on = false;
	}

	destroyed() {
		this.object.dispose();
	}

	set type(value) {
		// Map to THREE class
		const _type = `${value}Controls`;

		const fn = resolvers[value] || resolvers[_type];
		if (!fn) {
			throw new Error(`No handler for type: ${value}`);
		}

		// Call resolver
		const object = fn(this.$root);
		this.object = object;
		console.log(object);
	}

	static get observedAttributes() {
		return ["type"];
	}

	attributeChangedCallback(key, oldValue, value) {
		console.log(key, value)
		this[key] = value;
	}

	tick(delta) {
		if (!this.object) return;
		if (!this.on) return;

		this.object.update(delta);
	}

	mounted() {
		// Apply attributes
		this.applyAllAttributes();
	}
}

ThreeWebc.define("controls", Controls);

class ControlsManager extends ThreeWebc.Element {
	constructor() {
		super();
		this.current = null;
		this.enabled = false;
	}

	attributeChangedCallback(key, oldValue, value) {
		this[key] = value;
	}

	get items() {
		return this.querySelectorAll("t-controls");
	}

	set active(value) {
		if (!value) return;

		// Inform DOM
		this.setAttribute("active", value);
		// Disable previous?
		if (this.current) {
			this.current.on = false;
		}
		const el = document.querySelector(value);
		el.on = true;
		this.current = el;
	}

	get active() {
		return this.current;
	}

	mounted() {
		// Apply attributes
		this.applyAllAttributes();
	}
}

ThreeWebc.define("controls-manager", ControlsManager);
