import * as THREE from "three";
import { applyAttributes } from "./object3d.js";
import { ThreeWebc } from "three-webc";

class Object extends ThreeWebc.Element {
  constructor() {
    super()
    this.object =  new THREE.Object3D()
  }

  mounted() {
    if(this.getAttribute('@mount')) {
      const fn = new Function(`return ({THREE}) => ${this.getAttribute('@mount')}`);
      const resp = fn()({THREE})
      this.object = resp
    }

    // applyAttributes(this, object);

    // Add to scene
    const { scene } = this.parentElement;
    scene.add(this.object);
  }

  disconnectedCallback() {
    this.object?.removeFromParent();
  }
}

ThreeWebc.define("object", Object);
