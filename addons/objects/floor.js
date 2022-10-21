import * as THREE from "three";
import { ThreeWebc } from "three-webc";

ThreeWebc.define(
	"floor",
	class Element extends ThreeWebc.Element {
		constructor() {
			super();
			const mesh = new THREE.Mesh(
				new THREE.PlaneGeometry(10, 10),
				new THREE.MeshStandardMaterial({ color: 0x999999, depthWrite: false })
			);
			mesh.rotation.x = -Math.PI / 2;
			mesh.receiveShadow = true;
			this.mesh = mesh
		}

		async mounted() {
			this.scene.add(this.mesh);
		}

		destroyed() {
			this.mesh?.removeFromParent();
			this.mesh.material.dispose();
			this.mesh?.geometry.dispose();
		}
	}
);
