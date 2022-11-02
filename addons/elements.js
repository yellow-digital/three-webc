import * as THREE from "three";
import { ThreeWebc, ThreeElement } from "three-webc/index.js";

import { MathUtils } from "three";

export const parseDeg = (value = "") => {
	const r = value.trim().match(/^([0-9\.\- ]+)deg$/);
	if (r) return MathUtils.degToRad(parseFloat(r[1]));
};

export const attributeValueToArray = (value = "") =>
	value
		.split(/[, ]+/)
		.map((s) => s.trim())
		.map((s) => parseDeg(s) ?? floatOrNot(s));

const floatOrNot = (s = "") => {
	const f = parseFloat(s);
	return f || f === 0 ? f : s;
};

export const dasherize = (str = "") =>
	str
		.replace(/([A-Za-z0-9])([A-Z][a-z])/g, "$1-$2")
		.replace(/_/g, "-")
		.toLowerCase();

function getAttachType(object) {
	if (object.isMaterial) {
		return "material";
	}
	if (object.isGeometry || object.isBufferGeometry) {
		return "geometry";
	}
	if (object.isFog) {
		return "fog";
	}
	if (object.isColor) {
		return "color";
	}
	// console.warn('unknown attach type', object)
}

/**
 * Get all attributes of a HTML element
 * @param {*} element
 * @returns
 */
function getAllAttributes(element) {
	const attributes = {};
	element.getAttributeNames().forEach((name) => {
		attributes[name] = element.getAttribute(name);
	});
	return attributes;
}

const IGNORED_KEYS = ["args", "id"];

const parseJson = (value = "") => {
	let parsed = undefined;

	try {
		parsed = JSON.parse(value);
	} catch (e) {}

	return parsed;
};

/**
 * Function to apply an attribute to a ThreeJs Object
 * Based on https://github.com/hmans/three-elements/blob/main/packages/three-elements/src/util/applyProps.ts
 * @param {*} object 
 * @param {*} name 
 * @param {*} value 
 * @returns 
 */
function applyProp(object = {}, name = "", value) {
	const [firstKey, ...rest] = name.split(".")
	const key = firstKey.toLowerCase()

	/* Skip all ignored keys. */
	if (IGNORED_KEYS.includes(key)) return false;

	/* Skip all data attributes. */
	if (key.startsWith("data-")) return false;
	
	/* Handle boolean properties. */
	if (typeof object[key] === "boolean") {
		object[key] = ![undefined, null, false, "false"].includes(value);
		return true;
	}

	/* Recursively handle nested keys, eg. position.x */
	if (firstKey.toLowerCase() in object && rest.length > 0) {
		const isApplied = applyProp(object[key], rest.join("."), value)
		return isApplied
	}

	/* It is attribute-setting time! Let's try to parse the value. */
	const parsed =
		typeof value === "string" ? parseJson(value) ?? parseDeg(value) : value;

	/* Handle properties that provide .set methods */
	if (object[key]?.set) {
		/* If the value is an array, feed its destructured representation to the set method. */
		if (Array.isArray(parsed)) {
			object[key].set(...parsed);
			return true;
		}

		/* If we have a parsed value, set it directly */
		if (parsed) {
			object[key].set(parsed);
			return true;
		}

		/* Otherwise, set the original string value, but split by commas */
		const list = attributeValueToArray(value);
		object[key].set(...list);
		return true;
	}

	/*
	We're finally able to set a property on the object.
	Amazing! But let's only do it if the property key is actually known.
	*/
	if (key in object) {
		object[key] = parsed;
		return true;
	}

	return false;
}

function create(constructor = () => {}) {
	return class extends ThreeElement {
		threeConstructor = constructor;

		constructor() {
			super();
			this.object = this.construct();

			// if (object instanceof THREE.Object3D) {
			// 	object.userData.threeElement = this;
			// }
		}

		get observedAttributes() {
			// console.log("observedAttributes");
			return [""];
		}

		attributeChangedCallback(key, oldValue, value) {
			const { object } = this;

			const isApplied = applyProp(object, key, value);

			if (!isApplied) {
				this.debug("faild to set", object, key, value);
			}
		}

		mounted() {
			/* Handle attach attribute */
			this.handleAttach();

			/* Add object to scene */
			this.addObjectToScene();

			// Apply initial attributes
			this.applyAllAttributes();
		}

		get attach() {
			return getAttachType(this.object);
		}

		addObjectToScene() {
			const isObject3D = this.object instanceof THREE.Object3D;
			if (!isObject3D) return;

			const { parent } = this;

			if (!parent) {
				throw new Error(
					`Found no suitable parent for ${this.tagName}. Did you forget to add a <t-scene> tag? 😢`
				);
			}

			this.debug("adding", this.object);
			parent.scene.add(this.object);
		}

		handleAttach() {
			const { attach } = this;

			if (attach) {
				this.debug("attach", attach, "to", this.parent);
				this.parent.object[attach] = this.object;
			}
		}

		construct() {
			const object = new constructor();
			/* Create managed object */
			const args = this.getAttribute("args");

			if (args) {
				return new constructor(...attributeValueToArray(args));
			} else {
				return new constructor();
			}
		}

		destroyed() {
			/* If the wrapped object is parented, remove it from its parent */
			if (this.object instanceof THREE.Object3D && this.object.parent) {
				this.debug("Removing from scene:", this.object);
				this.object.parent.remove(this.object);
			}

			// /* If the object can be disposed, dispose of it! */
			// if (isDisposable(this.object)) {
			//   this.debug("Disposing:", this.object)
			//   this.object.dispose()
			// }
		}
	};
}

/*
For everything else inside THREE.* that can be constructed, automatically
generate a custom element.
*/
for (const threeProp of Object.getOwnPropertyNames(THREE)) {
	const threeClass = THREE[threeProp];
	const tagName = dasherize(threeProp);

	if (typeof threeClass === "function" && "prototype" in threeClass) {
		ThreeWebc.define(tagName, create(threeClass));
	}
}
