import * as THREE from "three";
import { applyAttributes } from "./object3d.js"

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

customElements.define(
  "t-geo",
  class extends HTMLElement {
    async connectedCallback() {
      setTimeout(() => { this.mounted() } )
    }

    mounted() {
      const { scene } = this.parentElement;

      const type = `${this.getAttribute("geo")}Geometry`;
      const geometry = new THREE[type]();
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        side: 2,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "object";
      scene.add(mesh);

      this.mesh = mesh
      
      applyAttributes(this, mesh)
    }

    disconnectedCallback() {
      this.mesh?.removeFromParent();
      // this.mesh?.material.dispose();
      // this.mesh?.geometry.dispose();
    }
  }
);
