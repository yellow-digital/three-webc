export const PREFIX = "t";

export function createFunction(mixed, ctx) {
  /* If the value is a string, we'll create a function from it. Magic! */
  if (typeof mixed === "string") {
    const fn = new Function("dt", "object = this.object", mixed).bind(ctx);
    return fn;
  }
  /* If it's already a function, we'll just use that. */
  if (typeof mixed === "function") {
    return (dt = 0) => mixed(dt, ctx);
  }
}

/**
 * Base class.
 */
export class ThreeElement extends HTMLElement {
  constructor() {
    super();
  }

  // get observedAttributes() {
  //   return [""];
  // }

  attributeChangedCallback(key = "", oldValue, newValue) {
    this.debug("attributeChangedCallback", key, oldValue, newValue);
    this[key] = newValue;
  }

  get $rootEl() {
    return this.closest("t-renderer") || {};
  }
  get $root() {
    return this.$rootEl.viewport
  }

  // TODO Migrate to $root or $rootEl
  get rendererEl() {
    return this.closest("t-renderer") || {};
  }
  get renderer() {
    return this.rendererEl.renderer;
  }
  get scene() {
    return this.parent.scene || this.rootScene;
  }
  get rootScene() {
    return this.rendererEl.scene;
  }
  get camera() {
    return this.rendererEl.camera;
  }
  set camera(value) {
    this.rendererEl.camera = value;
  }

  /**
   * Use this getter to find first parent Object3D
   */
  get parent() {
    return this.parentElement;
    // return this.find((node) => node instanceof ThreeElement)
  }

  getValue(name = "") {
    const fn = new Function(`return ${this.getAttribute(name)}`);
    return fn();
  }

  async connectedCallback() {
    this.debug("connectedCallback");

    /*
      Wait till all other elements have been loaded
    */
    setTimeout(() => {
      this.beforeMounted();
    });
  }

  beforeMounted() {
    // Call lifecycle method
    this.mounted(this.rendererEl);

    if (ThreeWebc.debug) {
      this.setAttribute("mounted", "");
    }

    // Apply hooks
    ThreeWebc.hooks.forEach((fn) => {
      fn(this);
    });

    // TODO cleanup on remove
    if (this.tick) {
      this.rendererEl.rafs.push((dt) => {
        this.tick(dt);
      });
    }

    this.dispatchEvent(new Event("ready"));
  }

  /**
   * Helper method that will make sure all attributes set on the element are passed
   * through `attributeChangedCallback`. We mostly need this because of how we're
   * _not_ using `observedAttributes`.
   */
  applyAllAttributes() {
    for (const key of this.getAttributeNames()) {
      this.attributeChangedCallback(key, "", this.getAttribute(key));
    }
  }

  /**
   * Hook for when the DOM is ready
   */
  mounted(view) {}

  /**
   * Hook for when the element is removed
   */
  destroyed() {
    this.debug("destroyed");
  }

  disconnectedCallback() {
    this.destroyed();
  }

  log(...args) {
    console.log(`${this.tagName}`, ...args);
  }

  debug(...args) {
    if (!ThreeWebc.debug) return;
    console.debug(`${this.tagName}`, ...args);
  }

  error(...args) {
    console.error(`${this.tagName}>`, ...args);
  }
}

/**
 * Tracks registered elements by mapping them from PascalPaseNames to their kebab-case
 * equivalents.
 */
export const registeredElements = {};
export const hooks = [];

export const ThreeWebc = {
  registeredElements,
  hooks,
  hook(cb = (el) => {}) {
    hooks.push(cb);
  },
  directive(tag = "", cb = (el, ctx = {}) => {}) {
    hooks.push((el) => {
      const value = el.getAttribute(tag)
      // Don't run this directive if not set.
      if (value === null) {
        return;
      }
      
      // Run callback
      cb(el, { value })
    });
  },
  debug: false,
  Element: ThreeElement,
  define,
  createFunction,
};

export default ThreeWebc;

/**
 * Convenience method to create a new custom element.
 * @param {*} tag 
 * @param {*} element 
 */
export function define(tag = "", element) {
  const name = `${PREFIX}-${tag}`;
  if (customElements.get(name)) {
    console.warn(`duplicate registration for: ${name}`);
    return;
  }

  customElements.define(name, element);
  registeredElements[tag] = element;
}
