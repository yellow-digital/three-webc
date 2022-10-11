import * as THREE from "three";
import { applyAttributes } from "./object3d.js";

export class Mesh extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => {
      this.mounted();
    });
  }
  
  mounted() {
    const view = this.parentElement.viewport;
    const { scene } = view;

    const type = `${this.getAttribute("geo")}Geometry`;
    const geometry = new THREE[type]();
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      side: 2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "object";
    scene.add(mesh);

    this.mesh = mesh;

    applyAttributes(this, mesh);
  }
}

customElements.define("t-mesh", Mesh);
