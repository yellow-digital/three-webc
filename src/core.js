
export const PREFIX = 't'

/**
 * Sugar for customElements.define("t-***", class extends HTMLElement {});
 * @param {*} tag 
 * @param {*} element 
 */
export function define(tag = '', element) {
  customElements.define(`${PREFIX}-${tag}`, element);
}

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
    return this.closest("t-renderer") || {};
  }
  
  get renderer() { return this.rendererEl.renderer; }
  
  get scene() { return this.rendererEl.scene; }
  
  get camera() { return this.rendererEl.camera; }
  set camera(value) { this.rendererEl.camera = value; }

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

export const ThreeWebc = {
  Element: ThreeElement,
  define
}

export default ThreeWebc