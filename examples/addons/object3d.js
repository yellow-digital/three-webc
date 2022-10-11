import * as THREE from "three";

/**
 * https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection
 * @param {*} obj 
 * @param {*} param1 
 */
export function getBoundingRect(obj, { renderer, camera }) {
  const vector = new THREE.Vector3();
  const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer

  obj.updateMatrixWorld(); // `obj´ is a THREE.Object3D
  vector.setFromMatrixPosition(obj.matrixWorld);

  vector.project(camera); // `camera` is a THREE.PerspectiveCamera

  const x = Math.round(
    (0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)
  );
  const y = Math.round(
    (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio)
  );
  return {x,y}
}

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
  get rafs() {
    return this.closest("t-renderer").rafs;
  }
  get renderer() {
    return this.closest("t-renderer").renderer;
  }
  get camera() {
    return this.closest("t-renderer").camera;
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

  async connectedCallback() {
    setTimeout(() => {
      this.mounted();
    });
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

customElements.define("t-object3d", Object3D);
