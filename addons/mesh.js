import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeWebc } from "three-webc";
import "./material.js";

export class Mesh extends ThreeWebc.Element {
  constructor() {
    super()
    this.mesh =  new THREE.Mesh()
    this.geometry = null
    this.material = null
  }

  get object() {
    return this.mesh
  }
  
  mounted({ scene }) {
    if(this.getAttribute(':geometry')) {
      const fn = new Function(`return ({THREE}) => ${this.getAttribute(':geometry')}`);
      const resp = fn()({THREE})
      this.geometry = resp
    }

    const type = `${this.getAttribute("geo")}Geometry`;
    const geometry = this.geometry || new THREE[type]();
    const material = this.material || new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
      side: 2,
    });
    // const mesh = new THREE.Mesh(geometry, material);
    const mesh = this.mesh
    mesh.castShadow = true
    mesh.geometry = geometry
    mesh.material = material
    mesh.name = this.getAttribute('name') || type;
    scene.add(mesh);
		mesh.castShadow = true

    this.mesh = mesh;

    applyAttributes(this, mesh);
  }

  disconnectedCallback() {
    this.mesh?.removeFromParent();
    // this.mesh.material.dispose();
    // this.mesh?.geometry.dispose();
  }
}

ThreeWebc.define("mesh", Mesh);
