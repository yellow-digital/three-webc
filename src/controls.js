import { ThreeWebc } from "three-webc";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Orbit extends ThreeWebc.Element {
	constructor() {
		super();
	}

	get object() {
		return this.controls;
	}

	mounted() {
		const { camera, renderer } = this;

		// controls
		const controls = new OrbitControls(camera, renderer.domElement);
		// controls.dampingFactor = 0.1
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls = controls;
		// controls.camera = this.camera

		// Proxy events
		controls.addEventListener('change', e => {
			// console.log(e)
			// Convert to proper DOM Event
			this.dispatchEvent(new CustomEvent('change', {detail: e}))
		})
	}

	destroyed() {
		this.controls.dispose();
	}

	async tick() {
		// only required if controls.enableDamping = true, or if controls.autoRotate = true
		if(!this.controls) return

		this.controls.update();
	}
}

ThreeWebc.define("orbit", Orbit);

const resolvers = {
	FirstPersonControls: async (view) => {
		const { FirstPersonControls } = await import(
			"three/addons/controls/FirstPersonControls.js"
		);

		const controls = new FirstPersonControls(
			view.camera,
			view.renderer.domElement
		);
		// controls.movementSpeed = 150;
		controls.lookSpeed = 0.1;

		view.rafs.push((delta) => {
			controls.update(delta);
		});
	},
	ArcballControls: async (view) => {
		const { ArcballControls } = await import(
			"three/addons/controls/ArcballControls.js"
		);

		const controls = new ArcballControls(
			view.camera,
			view.renderer.domElement,
			view.scene
		);
	},
	FlyControls: async (view) => {
		const { FlyControls } = await import(
			"three/addons/controls/FlyControls.js"
		);

		const controls = new FlyControls(view.camera, view.renderer.domElement);
		view.rafs.push((delta) => {
			controls.update(delta);
		});
	},
};

class Controls extends ThreeWebc.Element {
	constructor() {
		super();
		this.controls = null;
	}

	disconnectedCallback() {
		this.controls.dispose();
	}

	async mounted() {
		const fn = resolvers[this.getAttribute("type")];
		if (!fn) {
			throw new Error(`No handler for type: ${this.getAttribute("type")}`);
		}
		fn(this.parentElement.viewport);
	}
}

ThreeWebc.define("controls", Controls);
