import * as THREE from "three";
import { ThreeWebc } from "three-webc";

export class Raycaster extends ThreeWebc.Element {
  constructor() {
    super();

    const pointer = new THREE.Vector2();

    const state = {
      intersects: [],
      objects: [],
      intersections: 0,
      pointer,
      recursive: false,
      current: null,
    };
    this.raycaster = new THREE.Raycaster();

    this.state = state;
  }

  cast() {
    const { state, raycaster } = this;
    const { camera } = this.$renderer;
    const pointer = state.pointer;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(
      state.objects,
      state.recursive
    );
    return intersects;
  }

  update() {
    const { camera, scene } = this.$renderer
    const { state, raycaster } = this;
    const pointer = state.pointer;

    // console.log({...this.parentElement})
    state.objects = this.parentElement.scene.children;
    console.log(state.objects)

    // find intersections
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(
      state.objects,
      state.recursive
    );

    // @ts-ignore
    // const previous = state.intersects;
    state.intersects = intersects;
    state.intersections = intersects.length;

    this.dispatchEvent(new CustomEvent("update"));

    if (!intersects.length) {
      return;
    }
  }

  mounted({ scene, domElement }) {
    const { state } = this;
    const pointer = state.pointer;

    state.objects = scene.children;

    function onPointerMove(event) {
      // TODO use correct domElement rect
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    const onClick = (e) => {
      if (!state.intersects.length) {
        this.dispatchEvent(new Event("deselect"));
        return;
      }

      this.dispatchEvent(new CustomEvent("click"));
    };

    const parent = domElement;
    parent.addEventListener("pointermove", onPointerMove);
    parent.addEventListener("pointermove", () => {
      this.update()
    });
    parent.addEventListener("click", onClick);
  }
}

ThreeWebc.define("raycaster", Raycaster);