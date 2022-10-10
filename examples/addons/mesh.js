import * as THREE from "three";

customElements.define(
  "t-mesh",
  class extends HTMLElement {
    async connectedCallback() {
      setTimeout(this.mounted.bind(this));
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

      // Apply attributes
      {
        const fn = new Function(`return ${this.getAttribute(":rotation")}`);
        const rotation = {...fn()};
        mesh.rotation.x = rotation.x || 0;
        mesh.rotation.y = rotation.y || 0;
        mesh.rotation.z = rotation.z || 0;
      }

      {
        const fn = new Function(`return ${this.getAttribute(":position")}`);
        const position = {...fn()};
        mesh.position.x = position.x || 0;
        mesh.position.y = position.y || 0;
        mesh.position.z = position.z || 0;
      }
    }
  }
);
