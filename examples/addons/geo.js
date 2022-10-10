import * as THREE from "three";

// Apply attributes
export function applyAttributes(el, mesh) {
  {
    const fn = new Function(`return ${el.getAttribute(":position")}`);
    const vec = { x:0, y:0, z:0, ...fn() };
    mesh.position.set(vec.x, vec.y, vec.z);
  }

  {
    const fn = new Function(`return ${el.getAttribute(":rotation")}`);
    const vec = { x:0, y:0, z:0, ...fn() };
    mesh.rotation.set(vec.x, vec.y, vec.z);
  }

  {
    const fn = new Function(`return ${el.getAttribute(":scale")}`);
    const vec = { x: 1, y:1, z: 1, ...fn() };
    mesh.scale.set(vec.x, vec.y, vec.z);
  }
}

customElements.define(
  "t-geo",
  class extends HTMLElement {
    async connectedCallback() {
      setTimeout(() => { this.mounted() } )
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

      console.log(type)
      // Apply attributes
      applyAttributes(this, mesh)
    }
  }
);
