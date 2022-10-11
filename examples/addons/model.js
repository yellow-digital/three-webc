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
    async connectedCallback() {
      setTimeout(() => {
        this.mounted();
      });
    }

    get position() {
      return this.mesh.position;
    }
    get rotation() {
      return this.mesh.rotation;
    }
    get scale() {
      return this.mesh.scale;
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

      scene.add(mesh);

      if(getBooleanAttribute(this.getAttribute('debug'))) {
        const box = new THREE.BoxHelper( mesh, 0xffff00 );
        scene.add( box );
      }

      // Play animation
      const mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0])
        // .setDuration(1)
        .play();
      // mixers.push(mixer);
      // for ( let i = 0; i < mixers.length; i ++ ) {
      // 	mixers[ i ].update( delta );
      // }
      function animate(delta) {
        mixer.update(delta);
      }

      rafs.push(animate);

      // Save refs
      this.gltf = gltf;
      this.mesh = mesh;
      this.mixer = mixer;

      this.dispatchEvent(new Event("ready"));
    }
  }
);
