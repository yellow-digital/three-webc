class GuiElement extends HTMLElement {
  async connectedCallback() {
    setTimeout(this.mounted.bind(this))
  }
  async mounted() {
    const { GUI } = await import("https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm");
    const gui = new GUI();
  }
}

customElements.define(
  "t-gui",
  GuiElement
);
