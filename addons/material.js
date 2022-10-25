import * as THREE from "three";
import { ThreeWebc } from "three-webc";

export class Material extends ThreeWebc.Element {
  constructor() {
    super()
    this.material = {}
  }

  mounted() {
    const type = `${this.getAttribute("type")}Material`;
    if (!THREE[type]) {
      throw new Error(`Unknown constructor ${type}`);
    }

    const material = new THREE[type]({
      color: this.color || this.getAttribute("color") || "",
      side: 2,
      // Mixin initial settings
      ...this.material
    });
    this.material = material;

    // Attach
    const parent = this.parentElement;
    parent.material = material;
  }

  disconnectedCallback() {
    this.material.dispose();
  }
}

ThreeWebc.define("material", Material);
