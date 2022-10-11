import * as THREE from "three";

export function basicScene(view) {
  const { scene } = view;

  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "object";
  scene.add(mesh);

  {
    const mesh = new THREE.AxesHelper(100);
    scene.add(mesh);
  }

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

  view.rafs.push(() => {
    lights.rotation.z += 0.005;
  });
}

class THello extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => { this.mounted() } )
  }
  mounted() {
    const view = this.parentElement.viewport;
    basicScene(view);
  }
}

customElements.define("t-hello", THello);
