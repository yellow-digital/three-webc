import {ObjectGui} from "./GuiHelpers.js";

class Element extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => this.mounted)
  }
  async mounted() {
    // Resolve parent
    const view = this.parentElement.viewport;

    const { GUI } = await import("https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm");
    const gui = new GUI();

    const folder = gui.addFolder("scene").open(false);
    this.controller = new ObjectGui(view.scene).addTo(folder)
  }
}

customElements.define(
  "t-scene-gui",
  Element
);