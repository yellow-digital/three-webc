import * as THREE from "three";

export class Material extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => {
      this.mounted();
    });
  }

  mounted() {
    // Resolve parent
    const {mesh = null} = {...this.parentElement};
    if(!mesh) {
        throw new Error('Parent has no mesh')
    }
    
    const type = `${this.getAttribute("type")}Material`;
    if(!THREE[type]) {
      throw new Error(`Unknown constructor ${type}`)
    }

    const material = new THREE[type]({
      color: this.getAttribute('color') || '',
      side: 2,
    });
    mesh.material = material
  }
}

customElements.define("t-material", Material);
