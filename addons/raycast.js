import * as THREE from "three";
import { ThreeWebc } from "three-webc";

function onPointerMove(event) {
	// TODO use correct domElement rect
	const pointer = {};
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	return pointer;
}

export class Raycast extends ThreeWebc.Element {
	constructor() {
		super();

		const pointer = new THREE.Vector2();

		const state = {
			pointer,
			recursive: false,
		};
		this.raycaster = new THREE.Raycaster();

		this.state = state;
	}

  onPointerMove(event) {
    const pointer = this.state.pointer;

    // TODO use correct domElement rect
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

	mounted({domElement}) {
		const { state, parentElement } = this;

		const parent = domElement;
		parent.addEventListener("pointermove", this.onPointerMove.bind(this));
	}

	cast() {
		const { state, raycaster } = this;
		const { camera } = this.$renderer;

		const pointer = state.pointer;

		raycaster.setFromCamera(pointer, camera);

		const objects = this.parentElement.scene.children;

		const intersects = raycaster.intersectObjects(
			objects,
			state.recursive
		);
		return intersects;
	}
}

ThreeWebc.define("raycast", Raycast);
