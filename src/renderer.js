import * as THREE from "three";

export class Viewport {
  constructor(options = {}) {
    this.rafs = [];
    this.playing = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    this.scene = scene;
    this.controls = null;
    this.container = null;
    this.THREE = THREE;
    this.clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({ antialias: true, ...options });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap; // default THREE.PCFShadowMap
    this.renderer = renderer;

    const camera = new THREE.PerspectiveCamera(
      60,
      1, // updated by onWindowResize
      0.01,
      10000000
    );
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

  render() {
    const delta = this.clock.getDelta();

    this.rafs.forEach((fn) => {
      fn(delta);
    });
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

export class Animater {
  constructor() {
    this.rafs = [];
    this.playing = true;
    this.clock = new THREE.Clock();
  }

  stop() {
    this.playing = false;
  }

  animate() {
    requestAnimationFrame(() => {
      if (this.playing) {
        this.animate();
      }
    });

    this.render();
  }

  render() {
    const delta = this.clock.getDelta();
    this.rafs.forEach((fn) => {
      fn(delta);
    });
  }
}

class TRenderer extends HTMLElement {
  constructor() {
    super();
    const viewport = new Viewport();
    this.viewport = viewport;
    // this.animator = new Animater();
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
  set camera(cam) {
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

    // Debug info
    this.viewport.rafs.push(() => {
      this.dispatchEvent(new Event("render"));

      this.setAttribute('rafs', this.viewport.rafs.length)
    })

    // Sugar
    if (this.getAttribute("controls")) {
      const el = document.createElement("t-controls");
      el.setAttribute("type", this.getAttribute("controls"));
      this.append(el);
    }

    if (!this.getAttribute("controls") && this.getAttribute("orbit") === "") {
      const el = document.createElement("t-orbit");
      this.append(el);
    }
  }
}

customElements.define("t-renderer", TRenderer);
