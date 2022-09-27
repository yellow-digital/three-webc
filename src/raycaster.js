import * as THREE from "three"

customElements.define(
  "t-raycaster",
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      setTimeout(this.mounted.bind(this));
    }

    mounted() {
      const view = this.parentElement.viewport;

      const { camera } = view;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const state = {
        intersects: [],
        objects: view.scene.children,
        intersections: 0,
        pointer
      };
      this.state = state;

      function onPointerMove(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      const update = () => {
        // find intersections
        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster
          .intersectObjects(state.objects, false)
        // @ts-ignore
        state.intersects = intersects;
        state.intersections = intersects.length;

        this.dispatchEvent(new CustomEvent("change"));
      };

      const onClick = (e) => {
        if (!state.intersects.length) {
          this.dispatchEvent(new Event("deselect"));
          return;
        }

        this.dispatchEvent(new CustomEvent("click"));
      };

      const parent = view.renderer.domElement;
      parent.addEventListener("pointermove", onPointerMove);
      parent.addEventListener("pointermove", update);
      parent.addEventListener("click", onClick);
    }
  }
);
