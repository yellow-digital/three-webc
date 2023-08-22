import * as THREE from "three";
import { ThreeWebc } from "./core.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

// NOTE this component should be defined after 'renderer' so it has access to it
ThreeWebc.define(
	"effect-composer",
	class extends ThreeWebc.Element {
		constructor() {
			super();
			this.composer = new EffectComposer(this.renderer);
		}
		mounted() {
			const { composer } = this;

			// Take over render
			this.rendererEl.viewport.render = (scene, camera) => {
				this.rendererEl.viewport.tick()
				composer.render();
			};
		}
	}
);