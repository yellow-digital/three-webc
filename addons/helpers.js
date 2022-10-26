import * as THREE from "three";
import { ThreeWebc } from "three-webc";

class Axes extends ThreeWebc.Element {
	mounted() {
		const view = this.parentElement.viewport;
		const { scene } = view;

		const mesh = new THREE.AxesHelper(this.getAttribute("size") || 100);
		scene.add(mesh);
	}
}

ThreeWebc.define("axes", Axes);
