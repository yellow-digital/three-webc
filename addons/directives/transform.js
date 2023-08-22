import { ThreeWebc } from "three-webc/index.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import * as THREE from "three";

ThreeWebc.directive("transform", (elements) => {
    const {object, scene } = el
    
    console.log(el)
    // const { camera, renderer, scene } = document.querySelector("t-renderer");

    const currentCamera = camera;
    
    const control = new TransformControls(currentCamera, renderer.domElement);
    
    scene.add(new THREE.GridHelper(10, 10, 0x888888, 0x444444));
    
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);
});