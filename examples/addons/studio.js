import * as THREE from "three";

export function basicScene(scene) {
  const light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  const lights = new THREE.Object3D();
  lights.name = "lights";
  scene.add(lights);
  {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 0); //default; light shining from top
    light.castShadow = true;
    lights.add(light);
  }

  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  scene.add(new THREE.GridHelper(10, 10, 0x888888, 0x444444));

  // view.rafs.push(() => {
  //   lights.rotation.z += 0.005;
  // });
}

customElements.define(
  "t-studio",
  class extends HTMLElement {
    constructor() {
      super()
      this.group = new THREE.Object3D()
    }
    async connectedCallback() {
      setTimeout(() => this.mounted(this.parentElement));
    }
    mounted(view) {
      view.scene.add(this.group)
      basicScene(view.scene);
    }
    disconnectedCallback() {
      this.group.removeFromParent();
    }
  }
);
