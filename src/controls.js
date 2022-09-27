customElements.define(
  "t-orbit",
  class extends HTMLElement {
    constructor() {
      super();
    }

    disconnectedCallback() {
      this.controls.dispose();
    }

    async connectedCallback() {
      // https://threejs.org/docs/#examples/en/controls/OrbitControls
      const { OrbitControls } = await import(
        "three/addons/controls/OrbitControls.js"
      );

      setTimeout(() => {
        const { camera, renderer, rafs } = this.parentElement.viewport;

        // controls
        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.dampingFactor = 0.1
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls = controls;

        rafs.push(() => {
          // only required if controls.enableDamping = true, or if controls.autoRotate = true
          this.controls.update();
        });
      });
    }
  }
);

const resolvers = {
  FirstPersonControls: async (view) => {
    const { FirstPersonControls } = await import(
      "three/addons/controls/FirstPersonControls.js"
    );

    const controls = new FirstPersonControls(
      view.camera,
      view.renderer.domElement
    );
    // controls.movementSpeed = 150;
    controls.lookSpeed = 0.1;

    view.rafs.push((delta) => {
      controls.update(delta);
    });
  },
  ArcballControls: async (view) => {
    const { ArcballControls } = await import(
      "three/addons/controls/ArcballControls.js"
    );

    const controls = new ArcballControls(
      view.camera,
      view.renderer.domElement,
      view.scene
    );
  },
  FlyControls: async (view) => {
    const { FlyControls } = await import(
      "three/addons/controls/FlyControls.js"
    );

    const controls = new FlyControls(view.camera, view.renderer.domElement);
    view.rafs.push((delta) => {
      controls.update(delta);
    });
  },
};

customElements.define(
  "t-controls",
  class extends HTMLElement {
    constructor() {
      super();
      this.controls = null;
    }

    disconnectedCallback() {
      this.controls.dispose();
    }

    async connectedCallback() {
      setTimeout(() => {
        const fn = resolvers[this.getAttribute("type")];
        if (!fn) {
          throw new Error(`No handler for type: ${this.getAttribute("type")}`);
        }
        fn(this.parentElement.viewport);
      });
    }
  }
);
