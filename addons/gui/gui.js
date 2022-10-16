import { GUI } from "https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm"

export class GuiElement extends HTMLElement {
  async mounted() {
    const gui = new GUI();
    this.gui = gui

    this.dispatchEvent(new Event("ready"));
  }
}

customElements.define(
  "lil-gui",
  GuiElement
);
