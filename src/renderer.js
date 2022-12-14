import * as THREE from "three";
import { ThreeWebc } from "./core.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

export class Viewport {
  constructor(options = {}) {
    this.rafs = [];
    this.playing = true;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xcccccc);
    this.scene = scene;
    this.controls = null;
    this.container = null;
    this.THREE = THREE;
    this.clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({ antialias: true, ...options });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap;
    this.renderer = renderer;

    // Initial camera
    const camera = new THREE.PerspectiveCamera(
      60,
      1, // updated by onWindowResize
      0.01,
      10000000
    );
    camera.name = "camera0"
    camera.position.z = 5;
    this.camera = camera;
  }

  get boundingClientRect() {
    const elem = this.container;

    const { width, height } = elem
      ? elem.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    return { width, height };
  }

  get aspectRatio() {
    const { width, height } = this.boundingClientRect;

    return width / height;
  }

  mount(container) {
    this.container = container;

    container.appendChild(this.renderer.domElement);

    // Set initial view
    this.onWindowResize();

    window.addEventListener("resize", (e) => {
      this.onWindowResize();
    });

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => {
      if (this.playing) {
        this.animate();
      }
    });

    this.renderStopOnError();
  }

  renderStopOnError() {
    try {
      this.render();
    } catch (err) {
      this.playing = false;
      throw err;
    }
  }

  tick() {
    const delta = this.clock.getDelta();

    this.rafs.forEach((fn) => {
      fn(delta);
    });
  }

  render() {
    this.tick()
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const { camera, renderer } = this;

    const elem = this.container;

    const { width, height } = elem
      ? elem.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    renderer.setSize(width, height);
  }
}

class TRenderer extends ThreeWebc.Element {
  constructor() {
    super();
    const viewport = new Viewport();
    this.viewport = viewport;
    ThreeWebc.debug = this.getAttribute('debug') === "";
  }
  get THREE() {
    return THREE;
  }
  get scene() {
    return this.viewport.scene;
  }
  get renderer() {
    return this.viewport.renderer;
  }
  get camera() {
    return this.viewport.camera;
  }
  get controls() {
    return this.viewport.controls;
  }
  set controls(value) {
    this.viewport.controls = value
  }
  set camera(cam) {
    this.debug('new cam', cam)
    this.viewport.camera = cam;
  }
  get rafs() {
    return this.viewport.rafs;
  }
  get domElement() {
    return this.viewport.renderer.domElement;
  }

  async connectedCallback() {
    this.viewport.mount(this);

    this.viewport.rafs.push(() => {
      this.dispatchEvent(new Event("render"));
      
      // Debug info
      this.setAttribute('rafs', this.viewport.rafs.length)
    })

    // Sugar
    if (this.getAttribute("orbit") === "") {
      const el = document.createElement("t-orbit");
      this.append(el);
    }
  }
}

ThreeWebc.define("renderer", TRenderer);

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