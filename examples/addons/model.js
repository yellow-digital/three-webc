import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_hemisphere.html



customElements.define(
  "t-model",
  class extends HTMLElement {
    async connectedCallback() {
      setTimeout(() => { this.mounted() } )
    }
    async mounted() {
      const view = this.parentElement.viewport;
      const { scene } = view;

      const loader = new GLTFLoader();

      const url = this.getAttribute("url");

      const gltf = await loader.loadAsync(url);
      const mesh = gltf.scene.children[0];

      this.gltf = gltf

      const s = 0.02;
      mesh.scale.set(s, s, s);
      mesh.rotation.y = -1;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);

      // Play animation
      const mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1).play();
      // mixers.push(mixer);
      // for ( let i = 0; i < mixers.length; i ++ ) {
      // 	mixers[ i ].update( delta );
      // }
      function animate(delta) {
      	mixer.update( delta );
      }

      view.rafs.push(animate)
    }
  }
);
