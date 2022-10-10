import * as THREE from "three";

customElements.define(
    "t-axes",
    class extends HTMLElement {
      async connectedCallback() {
        setTimeout(() => { this.mounted() } )
      }
      mounted() {
        const view = this.parentElement.viewport;
        const { scene } = view;
  
        const mesh = new THREE.AxesHelper(this.getAttribute("size") || 100);
        scene.add(mesh);
      }
    }
  );
  