import * as THREE from "three";

export function applyAttributes(el, mesh) {
  if (el.getAttribute(":position")) {
    const fn = new Function(`return ${el.getAttribute(":position")}`);
    const vec = { x: 0, y: 0, z: 0, ...fn() };
    mesh.position.set(vec.x, vec.y, vec.z);
  }

  if (el.getAttribute(":rotation")) {
    const fn = new Function(`return ${el.getAttribute(":rotation")}`);
    const vec = { x: 0, y: 0, z: 0, ...fn() };
    console.log(vec);
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

export class Object3D extends HTMLElement {
  constructor() {
    super();
    const mesh = new THREE.Object3D();
    this.mesh = mesh;

    this.scene = mesh;
  }
  // Proxy to allow nesting
  get renderer() {
    return this.closest('t-renderer').renderer
  }
  get camera() {
    return this.closest('t-renderer').camera
  }

  async connectedCallback() {
    setTimeout(() => {
      this.mounted();
    });
  }

  mounted() {
    const { scene } = this.parentElement;

    console.log(this.parentElement)
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

customElements.define("t-object3d", Object3D);
