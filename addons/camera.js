import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeWebc } from "three-webc";

export class PerspectiveCamera extends ThreeWebc.Element {
  get position() {
    return this.camera.position
  }

  get aspect() {
    return this.rendererEl?.aspectRatio
  }

  mounted() {
    const camera = new THREE.PerspectiveCamera(60, this.aspect, 0.01, 10000000)

    applyAttributes(this, camera);

    // Overrule previous camera?
    this.rendererEl.camera = camera

    // Also add to scene
    this.scene.add(camera)
  }

  destroyed() {
    this.camera.removeFromParent()
  }
}

ThreeWebc.define("camera", PerspectiveCamera);