import * as THREE from "three"
import { ThreeWebc } from "three-webc"

export class Axes extends ThreeWebc.Element {
	mounted({ scene }) {
		const mesh = new THREE.AxesHelper(this.getAttribute("size") || 100)
		scene.add(mesh)
	}
}

ThreeWebc.define("axes", Axes)
