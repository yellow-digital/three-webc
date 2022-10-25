import * as THREE from "three";

const KEYS = [
	"color",
];

const textureLoader = new THREE.TextureLoader();

export const applyStylesAndWatch = (element, keys = KEYS) => {
	applyComputedStyles(element, keys);

	// Add to inline style to observe
	// NOTE Uses t-material set styles()
	element.setAttribute("style", element.styles);

	watchInlineStyles(element, keys);
};

const applyAttributeToMaterial = (material = {}, key = "", value = "") => {
	if (!material) {
		throw new Error("material is missing");
	}
	if (!value) {
		return false
	}

  // Url?
  if(value.includes("url(")) {
    // convert css rule: url("http://link") to string
    const script = 'const url = u => u; return '+ value
    const fn = new Function(script)
    const url = fn()

    const texture = textureLoader.load(url)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
	material[key] = texture
    return true
  }

	// Has a set?
	if (material[key]?.set) {
		material[key].set(value);
		return true;
	}

	// Normal property
	if (key in material) {
		material[key] = value;
		return true;
	}

	console.warn(`failed to set ${key}`, material, material[key]);
	return false;
};

export const applyComputedStyles = (element, keys = KEYS) => {
	const styles = getComputedStyle(element);

	keys.forEach((key) => {
		const property = `--${key}`;
		const value = styles.getPropertyValue(property);

		// directly to material
		applyAttributeToMaterial(element.material, key, value.trim());
	});
};

export const watchInlineStyles = (element, keys = KEYS) => {
	observeAttributeChange(element, (prop, value, { target }) => {
		applyComputedStyles(element, keys);
	});
};

export const observeAttributeChange = (
	el,
	callback = (prop = "", value = "", mutation) => {}
) => {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "attributes") {
				const element = mutation.target;
				const name = mutation.attributeName;
				const value = element.getAttribute(name);

				callback(name, value, mutation);
			}
		});
	});

	observer.observe(el, { attributes: true, attributeFilter: ["style"] });

	return observer;
};
