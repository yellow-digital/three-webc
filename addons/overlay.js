import * as THREE from "three";
import { ThreeWebc } from "three-webc";

/**
 * https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection
 * @param {*} vector
 * @param {*} param1
 */
export function projectToCameraFromVector(
	position = new THREE.Vector3(),
	{ renderer, camera }
) {
	const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer
  position = position.clone()
	position.project(camera); // `camera` is a THREE.PerspectiveCamera

	const x = Math.round(
		(0.5 + position.x / 2) * (canvas.width / window.devicePixelRatio)
	);
	const y = Math.round(
		(0.5 - position.y / 2) * (canvas.height / window.devicePixelRatio)
	);

  var distance = camera.position.distanceTo( position );
	return { x, y, distance };
}

class Overlay extends ThreeWebc.Element {
	tick() {
		const target = this.parentElement.mesh;

		const pos = projectToCameraFromVector(
			target.position,
			document.querySelector("t-renderer")
		);
		this.style.top = `${pos.y}px`;
		this.style.left = `${pos.x}px`;
	}
}

ThreeWebc.define("overlay", Overlay);
