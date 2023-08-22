import * as THREE from "three";
import { ThreeWebc } from "./core.js";

class TRenderer extends ThreeWebc.Element {
  constructor() {
    super();
    ThreeWebc.debug = this.getAttribute('debug') === "";

    this.rafs = [];
    this.playing = true;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xcccccc);
    this.scene = scene;
    this.controls = null;
    this.container = null;
    this.THREE = THREE;
    this.clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
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
 
  async connectedCallback() {
    this.mount(this);

    this.rafs.push(() => {
      this.dispatchEvent(new Event("render"));
      
      // Debug info
      this.setAttribute('rafs', this.rafs.length)
    })

    // Sugar
    if (this.getAttribute("orbit") === "") {
      const el = document.createElement("t-orbit");
      this.append(el);
    }
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

    this.animator();
  }

  animator() {
    requestAnimationFrame(() => {
      if (this.playing) {
        this.animator();
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

ThreeWebc.define("renderer", TRenderer);
