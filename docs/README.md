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

# Overview
Three-webc is a light bridge between web elements and ThreeJS. Which lets you define basic `elements` and `directives` plus it comes which some `addons` to get your started.

# Element

An element bridges the gap between HTML and threejs. Here is an minimal example of an axes:
```html
<script type="module">
import { ThreeWebc } from "three-webc";

ThreeWebc.define("axes", class extends ThreeWebc.Element {
	mounted({scene}) {
		const mesh = new THREE.AxesHelper(this.getAttribute("size") || 100);
		scene.add(mesh);
	}
});
</script>

<t-axes></t-axes>
```

The `ThreeWebc.Element` provides some sugar around the default `HTMLElement`. It consist of the following lifecycle hooks `mounted` (called when the element is added and the renderer is ready) and `destroyed` (is called when the element is removed from the DOM or scene). To access the renderer in the class you can always use `this.$renderer`.

```html
<script type="module">
import { ThreeWebc } from "three-webc";

ThreeWebc.define("axes", class extends ThreeWebc.Element {
	mounted({scene}) {
		console.log(this.$renderer)
	}
});
</script>

<t-object3d name="group">
	<t-mesh position="2,0,0"></t-mesh>
</t-object3d>
```


# Directives
A directive adds power and flexibility. To create a directive see the following example:

```html
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

To get the renderer you can get it from the element like:
```js
ThreeWebc.directive("interval", (el, {value}) => {
	console.log(el.$renderer)
});
```