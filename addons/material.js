import * as THREE from "three";
import { ThreeElement } from "three-webc";

export class Material extends ThreeElement {
  mounted() {
    const type = `${this.getAttribute("type")}Material`;
    if (!THREE[type]) {
      throw new Error(`Unknown constructor ${type}`);
    }

    const material = new THREE[type]({
      color: this.getAttribute("color") || "",
      side: 2,
    });
    this.material = material;

    // Attach
    // Resolve parent
    const parent = this.parentElement;
    parent.material = material;
  }

  disconnectedCallback() {
    this.material.dispose();
  }
}

customElements.define("t-material", Material);
