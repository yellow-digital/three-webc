import { ThreeWebc } from "three-webc";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Orbit extends ThreeWebc.Element {
	constructor() {
		super();
	}

	get object() {
		return this.controls;
	}

	mounted({ camera, renderer }) {
		const controls = new OrbitControls(camera, renderer.domElement);
		// controls.dampingFactor = 0.1
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls = controls;
		// controls.camera = this.camera

		// Tell $root
		renderer.controls = controls

		// Proxy events
		controls.addEventListener('change', e => {
			// Convert to proper DOM Event
			this.dispatchEvent(new CustomEvent('change', {detail: e}))
		})
	}

	destroyed() {
		this.controls.dispose();
	}

	tick() {
		// only required if controls.enableDamping = true, or if controls.autoRotate = true
		if(!this.controls) return

		this.controls.update();
	}
}

ThreeWebc.define("orbit", Orbit);
