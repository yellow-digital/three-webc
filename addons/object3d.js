import * as THREE from "three";
import { ThreeWebc } from "three-webc";

export function applyAttributes(el, mesh) {
  if (el.getAttribute(":position")) {
    const fn = new Function(`return ${el.getAttribute(":position")}`);
    const vec = { x: 0, y: 0, z: 0, ...fn() };
    mesh.position.set(vec.x, vec.y, vec.z);
  }

  if (el.getAttribute(":rotation")) {
    const fn = new Function(`return ${el.getAttribute(":rotation")}`);
    const vec = { x: 0, y: 0, z: 0, ...fn() };
    mesh.rotation.set(vec.x, vec.y, vec.z);
  }

  if (el.getAttribute(":scale")) {
    const fn = new Function(`return ${el.getAttribute(":scale")}`);
    const vec = { x: 1, y: 1, z: 1, ...fn() };
    mesh.scale.set(vec.x, vec.y, vec.z);
  }

  if (el.getAttribute(":props")) {
    const fn = new Function(`return ${el.getAttribute(":props")}`);
    Object.assign(mesh, fn());
  }
}

export class Object3D extends ThreeWebc.Element {
  constructor() {
    super();
    const mesh = new THREE.Object3D();
    this.mesh = mesh;
  }
  // Proxy to allow nesting
  get rafs() {
    return this.rendererEl.rafs;
  }
  get renderer() {
    return this.rendererEl.renderer;
  }
  get camera() {
    return this.rendererEl.camera;
  }
  get scene() {
    return this.mesh
  }

  // Sugars
  get position() {
    return this.mesh.position
  }
  get rotation() {
    return this.mesh.rotation
  }
  get scale() {
    return this.mesh.scale
  }
  get object() {
    return this.mesh
  }
  
  mounted() {
    // Find scene
    const { scene } = this.parentElement;

    const { mesh } = this;
    mesh.name = this.getAttribute("name") || "object";
    scene.add(mesh);

    applyAttributes(this, mesh);
  }

  disconnectedCallback() {
    this.mesh?.removeFromParent();
    // this.mesh.material.dispose();
    // this.mesh?.geometry.dispose();
  }
}

ThreeWebc.define("object3d", Object3D);
