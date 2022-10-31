import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeWebc } from "three-webc";

export class PerspectiveCamera extends ThreeWebc.Element {
  constructor() {
    super()
  }

  get position() {
    return this.camera.position
  }
  get object() {
    return this.camera
  }
  get aspect() {
    return this.rendererEl?.viewport.aspectRatio
  }

  mounted() {
    const camera = new THREE.PerspectiveCamera(60, this.aspect, 0.01, 10000000)

    applyAttributes(this, camera);

    // this.camera = camera
    
    // Overrule active camera?
    // this.rendererEl.camera = camera

    // add to scene
    this.scene.add(camera)
  }

  destroyed() {
    this.camera.removeFromParent()
  }
}

ThreeWebc.define("camera", PerspectiveCamera);