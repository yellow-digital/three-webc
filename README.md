# three-webc

> Webcomponents for [threejs]

Ease the setup for 3D graphics and maintain a straighforward integration with [threejs].

> **WARNING:** It is early days for this library, so please proceed with caution!

## Features

:eyeglasses: **Less code**: just drop in `<t-renderer>`.

:zap: **Performance**: a thin library on top of three.js. Just code as you use to.

:mag: **Visual Inspector**: As `three-webc` uses `WebComponents` you can use your browsers built-in inspector to change, add or remove elements.

:statue_of_liberty: **WebComponents**: Use it with any framework or HTML page!

# Goal
Our goal is to make it easier to share and reuse components for 3D web graphics.

# Usage
Find here more [examples](/three-webc/examples/list.html)

https://jsfiddle.net/yellowdigital/6jetkhpd/
```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.145.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.145.0/examples/jsm/",
      "three-webc": "https://cdn.jsdelivr.net/npm/three-webc/src/index.js",
      "three-webc/addons/": "https://cdn.jsdelivr.net/npm/three-webc/examples/addons/"
    }
  }
</script>

<t-renderer orbit>
	<t-object @mount="new THREE.AmbientLight( 0x404040 )"></t-object>
	<t-mesh>
		<t-geometry type="Box"></t-geometry>
		<t-material type="MeshStandard" color="green"></t-material>
	</t-mesh>
</t-renderer>

<script type="module">
  import "three-webc";
	import "three-webc/addons/index.js";

  const {scene, THREE} = document.querySelector("t-renderer");

  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
</script>
```

# FAQ
## Why webcomponents?
- Usable in any page or framework.
- The DOM brings some powerfull tools, for example by using `document.queryElement`. You can remove certain element from the scene by doing: `[...document.querySelectorAll('t-mesh')].forEach(e => e.remove())` (also runnable in the inspectors console)

## How do I create components?
Best way to start is looking at the examples. [examples](https://yellow-digital.github.io/three-webc/examples/list.html)

# Contribution
We welcome any input. If you have created a webcomponent for three-webc (for physics, particle system, custom shaders, ...), feel free to contact us at [Discord] so we can maintain a curated list.

# Similar projects
- [three-elements](https://github.com/hmans/three-elements) Great library that also uses webcomponents
- [trois](https://github.com/troisjs/trois) 
- [aframe](https://aframe.io) 

## Community

- [Discord] for chat & help

[discord]: https://discord.gg/fatjexFHNr
[threejs]: https://github.com/mrdoob/three.js
