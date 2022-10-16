import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeElement } from "three-webc";

export const GEOMETRIES = [
	"Box",
	"Capsule",
	"Circle",
	"Cone",
	"Cylinder",
	"Dodecahedron",
	"Edges",
	"Extrude",
	"Icosahedron",
	"Lathe",
	"Octahedron",
	"Plane",
	"Polyhedron",
	"Ring",
	"Shape",
	"Sphere",
	"Tetrahedron",
	"Torus",
	"TorusKnot",
	"Tube",
	"Wireframe",
];

class GeoElement extends ThreeElement {
	mounted() {
		const type = `${this.getAttribute("type")}Geometry`;
		if (!THREE[type]) {
			throw new Error(`Unknown constructor ${type}`);
		}
		const geometry = new THREE[type]();

		// Attach
		// Resolve parent
		const parent = this.parentElement;
		parent.geometry = geometry;
	}

	disconnectedCallback() {
		this.mesh?.removeFromParent();
		// this.mesh?.material.dispose();
		// this.mesh?.geometry.dispose();
	}
}

customElements.define("t-geometry", GeoElement);
