import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeWebc } from "three-webc";

class GeoElement extends ThreeWebc.Element {
  mounted({ scene }) {
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

  disconnectedCallback() {
    this.mesh?.removeFromParent();
    // this.mesh?.material.dispose();
    // this.mesh?.geometry.dispose();
  }
}

ThreeWebc.define("geo", GeoElement);
