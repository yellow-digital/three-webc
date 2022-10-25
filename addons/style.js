import * as THREE from "three";
import { ThreeWebc } from "three-webc";
import { applyStylesAndWatch, applyComputedStyles, watchInlineStyles } from "./style.utils.js";

// https://threejs.org/docs/index.html?q=mater#api/en/materials/MeshStandardMaterial
const KEYS = [
	"color",
	"metalness",
	"emissive",
	"roughness",
	"opacity",
	"displacementScale",
	"transparent",
	"map",
	"normalMap",
	"clearcoatRoughness",
];

function getThreeAttribute(object, key) {
	// In the set/get family
	if (object[key]?.getStyle) {
		// NOTE a browser sets rgb as rgb(119 26 42) which three doesn't accept
		return `#${object[key].getHexString()}`;
	}

	// Normal property
	if (key in object) {
		return object[key];
	}

	console.warn(`failed to get ${key}`, object, object[key]);
	return undefined;
}

class Material extends ThreeWebc.Element {
	constructor() {
		super();

		const material = new THREE.MeshPhysicalMaterial({
			side: 2,
		});
		this.material = material;
	}

	/** Convert material props to css */
	get styles() {
		const keys = KEYS; // Object.keys(this.material)

		const rules = keys.map((key) => {
			const value = getThreeAttribute(this.material, key);
			return value && `--${key}: ${value};`;
		});
		return rules.join(" ");
	}

	mounted() {
		// Use directive
		// applyStylesAndWatch(this, KEYS);
		const keys = KEYS
		const element = this
		applyComputedStyles(element, keys);

		// Add to inline style to observe
		// NOTE Uses t-material set styles()
		element.setAttribute("style", element.styles);
	
		watchInlineStyles(element, keys);

		// Attach
		const parent = this.parentElement;
		parent.material = this.material;
	}

	disconnectedCallback() {
		this.material.dispose();
	}
}

ThreeWebc.define("style", Material);
