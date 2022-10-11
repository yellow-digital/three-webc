import * as THREE from "three";
import { applyAttributes } from "./object3d.js";

export class PerspectiveCamera extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => {
      this.mounted();
    });
  }

  get position() {
    return this.camera.position
  }

  get viewport() {
    return this.parentElement.viewport
  }
  get aspect() {
    return this.viewport.aspectRatio
  }

  mounted() {
    const camera = new THREE.PerspectiveCamera(
      60,
      this.aspect,
      0.01,
      10000000
    );

    this.camera = camera

    applyAttributes(this, camera);

    // Overrule previous camera?
    this.viewport.camera = camera
  }
}

customElements.define("t-camera", PerspectiveCamera);
