export class GuiElement extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => this.mounted)
  }
  async mounted() {
    const { GUI } = await import("https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm");
    const gui = new GUI();
    this.gui = gui

    this.dispatchEvent(new Event("ready"));
  }
}

customElements.define(
  "t-gui",
  GuiElement
);
