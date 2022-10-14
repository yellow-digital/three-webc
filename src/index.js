export * from "./renderer.js";

import "./raycaster.js";
import "./controls.js";
import "./helpers.js";

/**
 * Base class.
 */
export class ThreeElement extends HTMLElement {
  constructor() {
    super();
  }

  attributeChangedCallback(key = "", oldValue, newValue) {
    this.log(key);
  }

  get rendererEl() {
    return this.closest("t-renderer");
  }

  async connectedCallback() {
    this.log("connectedCallback");

    /*
    Wait till all other elements have been loaded
    */
    setTimeout(() => {
      this.mounted(this.rendererEl);
    });
  }

  mounted() {}

  disconnectedCallback() {

  }

  log(...args) {
    // console.debug(`${this.tagName}`, ...args)
  }

  error(...args) {
    console.error(`${this.tagName}>`, ...args);
  }
}
