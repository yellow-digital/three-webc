# three-webc

> Webcomponents to ease the creation of 3D graphics in your browser.

This library makes it easy to set up 3D graphics and maintains a straighforward integration with [threejs](https://github.com/mrdoob/three.js).

## Features

:eyeglasses: **Less code**: just drop in `<t-renderer>`.

:zap: **Performance**: it is a thin library on top of three.js. Just code as you use to.

:mag: **Visual Inspector**: As `three-webc` uses `WebComponents` you can use your browsers built-in inspector to change, add or remove elements.

:statue_of_liberty: Use it with any framework!

# Why
There are some good wrapper libraries for `ThreeJs` but they felt a bit of an overkill nor abstract away coding or are framework dependent. This library provides a few webcomponents to aid exploring 3D in your browser faster.

# Similar projects
- [trois](https://github.com/troisjs/trois)
- [aframe](https://aframe.io)

# Usage
Find here more [examples](https://yellow-digital.github.io/three-webc/examples/list.html)

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/",
      "three-webc": "https://cdn.jsdelivr.net/npm/three-webc/src/index.js",
      "three-webc/addons/": "https://cdn.jsdelivr.net/npm/three-webc/examples/addons/"
    }
  }
</script>

<t-renderer orbit>
  <t-hello></t-hello>
</t-renderer>

<script type="module">
  import "three-webc";
  import "three-webc/addons/hello.js";
</script>
```

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.141.0/examples/jsm/",
      "three-webc": "https://cdn.jsdelivr.net/npm/three-webc/src/index.js"
    }
  }
</script>

<t-renderer orbit></t-renderer>

<script type="module">
  import "three-webc";
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
