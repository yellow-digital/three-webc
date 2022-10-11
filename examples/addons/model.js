import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { applyAttributes } from "./object3d.js";

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_hemisphere.html

function getBooleanAttribute(val) {
  if (val === "") return true;
  if (val === "true") return true;
  if (val === "1") return true;
  return false;
}

customElements.define(
  "t-model",
  class extends HTMLElement {
    constructor() {
      super()
      this.container = new THREE.Object3D();
    }

    async connectedCallback() {
      setTimeout(() => {
        this.mounted();
      });
    }

    get position() {
      return this.container.position;
    }
    get rotation() {
      return this.container.rotation;
    }
    get scale() {
      return this.container.scale;
    }

    async mounted() {
      const { scene, rafs } = this.parentElement;

      const loader = new GLTFLoader();

      const url = this.getAttribute("url");

      const gltf = await loader.loadAsync(url);
      const mesh = gltf.scene.children[0];

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.traverse((object) => {
        if (object.isMesh) object.castShadow = true;
      });

      applyAttributes(this, mesh);

      // Add to scene
      // scene.add(mesh);
      scene.add(this.container);
      this.container.add(mesh);

      // if(getBooleanAttribute(this.getAttribute('debug'))) {
        const box = new THREE.BoxHelper( mesh, 0xffff00 );
        // mesh.add( box );
        scene.add( box );
      // }

      const mixer = new THREE.AnimationMixer(mesh);
      this.mixer = mixer;
      
      // Play first animation
      if(gltf.animations[0]) {
        mixer.clipAction(gltf.animations[0])
          // .setDuration(1)
          .play();
        
        rafs.push((delta) => {
          mixer.update(delta);
          box.update();
        });
      }

      // Save refs
      this.gltf = gltf;
      this.mesh = mesh;

      this.dispatchEvent(new Event("ready"));
    }
  }
);
