import * as THREE from "three";
import { ThreeWebc } from "three-webc";

/**
 * https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection
 * @param {*} obj
 * @param {*} param1
 */
export function getBoundingRect(obj, { renderer, camera }) {
  const vector = new THREE.Vector3();
  const canvas = renderer.domElement; // `renderer` is a THREE.WebGLRenderer

  obj.updateMatrixWorld(); // `obj´ is a THREE.Object3D
  vector.setFromMatrixPosition(obj.matrixWorld);

  vector.project(camera); // `camera` is a THREE.PerspectiveCamera

  const x = Math.round(
    (0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)
  );
  const y = Math.round(
    (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio)
  );
  return { x, y };
}

class Overlay extends ThreeWebc.Element {
  mounted() {
    this.closest('t-renderer')?.addEventListener('render',this.update.bind(this))
    // this.closest('t-renderer').rafs.push(() => {
    //     this.update()
    // })
  }

  disconnectedCallback() {
    // TODO
    this.closest('t-renderer')?.removeEventListener('render',this.update.bind(this))
  }
  
  update() {
    const target = this.parentElement.mesh;

    const pos = getBoundingRect(
      target,
      document.querySelector("t-renderer")
    );
    this.style.top = pos.y;
    this.style.left = pos.x;
  }
}

ThreeWebc.define("overlay", Overlay);
