# three-webc

> A set of webcomponents for easy creation of 3D graphics in your browser.

This library shaves off some boiler code for setting up a scene and maintains a straighforward integration with threejs.

## Features

:eyeglasses: **Less code**: handle the 3D boilerplate required to get running just by dropping in `<t-renderer>`.

:heart: **Declarative HTML**: HTML is easy to read and copy-and-paste. As
it can be used from HTML, it is accessible to everyone: web
developers, educators, artists, makers, kids.

:zap: **Performance**: it is a thin library on top of three.js. Just code as you use to.

:mag: **Visual Inspector**: As three-webc uses WebComponents just use your built-in inspector to change, add or remove elements.

# Why
Webcomponents shows up in the DOM and therefor provides an easy way to interact and debug an application.

# Similar projects
- [trois](https://github.com/troisjs/trois)
- [aframe](https://aframe.io)

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
