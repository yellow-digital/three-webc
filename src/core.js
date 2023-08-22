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
    this.$renderer = this.closest("t-renderer") || {}
  }

  attributeChangedCallback(key = "", oldValue, newValue) {
    this.debug("attributeChangedCallback", key, oldValue, newValue);
    this[key] = newValue;
  }

  /**
   * Use this getter to find first parent Object3D
   */
  get parent() {
    return this.parentElement;
    // TODO safer
    // return this.find((node) => node instanceof ThreeElement)
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
    // Find closest scene in tree to allow nesting
    const scene = this.parentElement.scene || this.$renderer.scene
    // Call lifecycle method
    this.mounted({...this.$renderer, scene});

    // Apply hooks
    ThreeWebc.hooks.forEach((fn) => {
      fn(this);
    });

    // TODO cleanup on remove
    if (this.tick) {
      this.$renderer.rafs.push((dt) => {
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
  mounted(view) {
    this.debug("mounted");
  }

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
  /**
   * function to register a directive
   * @param {*} tag 
   * @param {*} cb (el, ctx) => {}
   */
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
