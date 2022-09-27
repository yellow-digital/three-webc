# three-webc

> A set of webcomponents for easy creation of 3D graphics in your browser

Using three-webc, developers who have a minimal knowledge of three.js can immediately start writing interactive 3D apps.

# Why
Webcomponents shows up in the DOM. This provides an easy way to interact with it from a developer perspective. Just add or delete elements from the inspector and voilla. No framework, no build step, just plain vanilla web browser style.

# Usage
```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/"
    }
  }
</script>

<t-renderer orbit></t-renderer>

<script type="module">
  import "../three-webc.js";
  import * as THREE from "three";

  const view = document.querySelector("t-view");

  const { scene } = view;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const mesh = new THREE.AxesHelper(100);
  scene.add(mesh);

  const light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
</script>
```