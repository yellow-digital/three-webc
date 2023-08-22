import { ThreeWebc } from "three-webc/index.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

ThreeWebc.directive("transform", (el) => {
    const { camera, renderer, scene } = document.querySelector("t-renderer");
  
    const currentCamera = camera;
  
    const control = new TransformControls(currentCamera, renderer.domElement);
  
    scene.add(new THREE.GridHelper(10, 10, 0x888888, 0x444444));
  
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);
  
    // const texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/crate.gif");
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshLambertMaterial({
    //   map: texture,
    //   transparent: true,
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
    const {mesh} = el
  
    control.attach(mesh);
    scene.add(control);
  
    const orbit = new OrbitControls(currentCamera, renderer.domElement);
    orbit.update();
  
    control.addEventListener("dragging-changed", function (event) {
      orbit.enabled = !event.value;
    });
});