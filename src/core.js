
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

  get observedAttributes() {
    return [""];
  }
  
  attributeChangedCallback(key = "", oldValue, newValue) {
    this.log('attributeChangedCallback', key, oldValue, newValue);
    this[key] = newValue
  }

  get rendererEl() {
    return this.closest("t-renderer") || {};
  }
  
  get renderer() { return this.rendererEl.renderer; }
  
  get scene() { return this.rendererEl.scene; }
  
  get camera() { return this.rendererEl.camera; }
  set camera(value) { this.rendererEl.camera = value; }

  getValue(name = '') {
    const fn = new Function(`return ${this.getAttribute(name)}`);
    return fn()
  }

  async connectedCallback() {
    this.log("connectedCallback");

    /*
    Wait till all other elements have been loaded
    */
    setTimeout(() => {
      this.mounted(this.rendererEl);
			this.setAttribute("mounted", "");
      if(this.tick) {
        // TODO cleanup on remove
        this.rendererEl.rafs.push(() => { this.tick() })
      }
    });
  }

  /**
   * Hook for when the DOM is ready
   */
  mounted() {}

  /**
   * Hook for when the element is removed
   */
  destroyed() {
    this.log("destroyed");
  }

  disconnectedCallback() {
    this.destroyed()
  }

  log(...args) {
    if(ThreeWebc.debug) {
      console.debug(`${this.tagName}`, ...args)
    }
  }

  error(...args) {
    console.error(`${this.tagName}>`, ...args);
  }
}

export const ThreeWebc = {
  debug: false,
  Element: ThreeElement,
  define
}

export default ThreeWebc