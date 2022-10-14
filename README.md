# three-webc

> Webcomponents to ease the creation of 3D graphics in your browser.

This library makes it easy to set up 3D graphics and maintains a straighforward integration with [threejs](https://github.com/mrdoob/three.js).

## Features

:eyeglasses: **Less code**: just drop in `<t-renderer>`.

:zap: **Performance**: it is a thin library on top of three.js. Just code as you use to.

:mag: **Visual Inspector**: As `three-webc` uses `WebComponents` you can use your browsers built-in inspector to change, add or remove elements.

:statue_of_liberty: **WebComponents**: Use it on any html page or framework!

# Goal

# Similar projects
- [trois](https://github.com/troisjs/trois)
- [aframe](https://aframe.io) 
- [three-elements](https://github.com/hmans/three-elements)

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
  
  // Interact from code
  const {scene} = document.querySelector("t-renderer");
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
</script>
```

# FAQ
## Why webcomponents?
By using webcomponents you can make visual composition, this greatly improves the development experience without loosing the ability to code. Also the DOM brings some very powerfull tools, for example by using `document.queryElement` you can write complex queries. For example you can quickly query certain components and remove it from the scene by doing: `[...document.querySelectorAll('t-mesh')].forEach(e => e.remove())` (just from your code or even directly from your inspectors console)

## Community

- [Discord] for chat & help

 # Contribution
 We welcome any input. You can get in contact with us at [Discord].
 
 [Discord]([discord]: https://discord.gg/fatjexFHNr)
