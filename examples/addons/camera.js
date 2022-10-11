export class Camera extends HTMLElement {
  async connectedCallback() {
    setTimeout(() => {
      this.mounted();
    });
  }

  mounted() {
    // Resolve parent
    const renderer = this.parentElement.viewport;

    renderer.rafs.push(() => {
      TWEEN.update();
    });
  }
}

customElements.define("t-camera", Camera);
