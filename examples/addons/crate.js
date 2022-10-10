import * as THREE from "three";

export function createCrate () {
  const texture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/crate.gif"
  );
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({
    // color: "green",
    map: texture,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh
}

customElements.define(
  "t-crate",
  class Element extends HTMLElement {
    async connectedCallback() {
      setTimeout(() => { this.mounted() } )
    }

    async mounted() {
      const { scene, renderer } = this.parentElement;

      const mesh = createCrate()
      scene.add(mesh);

      if (this.getAttribute("position")) {
        mesh.position.set(...this.getAttribute("position").split(","));
      }

      this.mesh = mesh;
    }

    disconnectedCallback() {
      this.mesh?.removeFromParent();
      this.mesh.material.dispose();
      this.mesh?.geometry.dispose();
    }
  }
);
