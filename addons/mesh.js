import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeElement } from "three-webc";
import "./material.js";

export class Mesh extends ThreeElement {
  constructor() {
    super()
    this.mesh = {}
    this.geometry = null
    this.material = null
  }

  mounted() {
    const { scene } = this.parentElement;

    const type = `${this.getAttribute("geo")}Geometry`;
    const geometry = this.geometry || new THREE[type]();
    const material = this.material || new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
      side: 2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = this.getAttribute('name') || type;
    scene.add(mesh);

    this.mesh = mesh;

    applyAttributes(this, mesh);
  }

  disconnectedCallback() {
    this.mesh?.removeFromParent();
    // this.mesh.material.dispose();
    // this.mesh?.geometry.dispose();
  }
}

customElements.define("t-mesh", Mesh);
