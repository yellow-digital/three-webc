# Setup
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

# Directives
A directive adds power and flexibility. To create a directive see the following example:

```js
<script type="module">
import { ThreeWebc } from "three-webc/index.js";

ThreeWebc.directive("interval", (el, {value}) => {
	const fn = ThreeWebc.createFunction(value);
	setInterval(() => {
		fn.apply(el);
	}, 1000);
});
</script>

<t-object
		interval="console.log('timeout', this)"
	></t-object>
```