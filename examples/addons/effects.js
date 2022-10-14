import { TWEEN } from "three/addons/libs/tween.module.min.js";
import { ThreeElement } from "three-webc";

export const bounce = (object, {duration = 200, scale = 2} = {}) => {
  const tween1 = new TWEEN.Tween(object.scale).to(
    { x: scale, y: scale, z: scale },
    duration / 2
  );
  const tween2 = new TWEEN.Tween(object.scale).to(
    { x: 1, y: 1, z: 1 },
    duration / 2
  );
  return tween1.chain(tween2).start();
};

export const remove = (object, {duration = 200} = {}) => {
  return new TWEEN.Tween(object.scale)
    .to({ x: 0, y: 0, z: 0 }, duration / 2)
    .start();
};

const EFFECTS = {
  bounce,
  remove
}

export class Effects extends ThreeElement {
  constructor() {
    super()
    this.EFFECTS = EFFECTS
  }

  mounted() {
    // Resolve parent
    const renderer = this.parentElement.viewport;

    renderer.rafs.push(() => {
      TWEEN.update();
    });
  }
}

customElements.define("t-effects", Effects);
