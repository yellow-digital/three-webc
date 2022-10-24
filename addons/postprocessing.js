import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { HalftonePass } from "three/addons/postprocessing/HalftonePass.js";
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";
import { DotScreenShader } from "three/addons/shaders/DotScreenShader.js";
import * as THREE from "three";
import { ThreeWebc } from "three-webc";

const postprocessors = {
	RenderPass,
	ShaderPass,
	GlitchPass,
	UnrealBloomPass,
	RGBShiftShader,
	DotScreenShader,
	HalftonePass,
};

/**
 * Helper to set THREE uniforms from an object
 * uniforms["amount"].value = 0.0015;
 * @param {*} object
 * @param {*} target
 */
function applyUniformsFromObject(object = {}, target = {}) {
	Object.keys(object).forEach((key) => {
		target[key].value = object[key];
	});
}

ThreeWebc.define(
	"effect",
	class extends ThreeWebc.Element {
		constructor() {
			super()

			const type = this.getAttribute("type");
			const pass = this.resolvePass(type);
			this.pass = pass;
		}

		static get observedAttributes() {
			return ["type"];
		}
		set type(value) {
			// console.log(value)
		}

		resolvePass(type = "") {
			if (type === "RenderPass") {
				return new RenderPass(this.scene, this.camera);
			}

			if (type === "UnrealBloomPass") {
				const pass = new UnrealBloomPass(
					new THREE.Vector2(window.innerWidth, window.innerHeight)
				);
				// const params = {
				// 	exposure: 1,
				// 	bloomStrength: 1.5,
				// 	bloomThreshold: 0,
				// 	bloomRadius: 0
				// };
				// pass.threshold = params.bloomThreshold;
				// pass.strength = params.bloomStrength;
				// pass.radius = params.bloomRadius;
				return pass;
			}

			if (type.includes("Shader")) {
				const shader = postprocessors[type];
				if (!shader) {
					throw new Error(`postprocessors '${type}' not found`);
				}
				const pass = new ShaderPass(shader);

				// Apply uniforms
				const uniforms = this.getValue(":uniforms") || {};
				applyUniformsFromObject(uniforms, pass.uniforms);

				return pass
			}

			if (type.includes("Pass")) {
				const pass = postprocessors[type];
				return new pass();
			}

			throw new Error(`type '${type}' not found`);
		}

		mounted() {
			this.composerEl = this.closest('t-effect-composer')
			this.composerEl.composer.addPass(this.pass);
		}

		destroyed() {
			this.composerEl.composer.removePass(this.pass);
		}
	}
);
