import * as THREE from "three";

function getBooleanAttribute(val) {
  if (val === "") return true;
  if (val === "true") return true;
  if (val === "1") return true;
  return false;
}

export function basicScene(scene) {
  const light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  const lights = new THREE.Object3D();
  lights.name = "lights";
  scene.add(lights);

  {
    const dirLight = new THREE.DirectionalLight( 0xffffff );
    // dirLight.position.set( - 3, 10, - 10 );
    dirLight.castShadow = true;
    const scale = 10
    dirLight.shadow.camera.top = scale;
    dirLight.shadow.camera.bottom = - scale;
    dirLight.shadow.camera.left = - scale;
    dirLight.shadow.camera.right = scale;
    // dirLight.shadow.camera.near = 0.1;
    // dirLight.shadow.camera.far = 40;
    scene.add( dirLight );
  }

  {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
  }

  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  // Floor
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
  
  // view.rafs.push(() => {
  //   lights.rotation.z += 0.005;
  // });
}

export default class extends HTMLElement {
  constructor() {
    super();
    this.group = new THREE.Object3D();
  }
  async connectedCallback() {
    setTimeout(() => this.mounted(this.parentElement));
  }
  mounted(view) {
    view.scene.add(this.group);
    basicScene(view.scene);

    if(getBooleanAttribute(this.getAttribute("debug"))) {

    }
  }
  disconnectedCallback() {
    this.group.removeFromParent();
  }
}