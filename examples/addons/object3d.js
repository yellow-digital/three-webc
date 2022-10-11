export function applyAttributes(el, mesh) {
  if (el.getAttribute(":position")) {
    const fn = new Function(`return ${el.getAttribute(":position")}`);
    const vec = { x: 0, y: 0, z: 0, ...fn() };
    mesh.position.set(vec.x, vec.y, vec.z);
  }

  if (el.getAttribute(":rotation")) {
    const fn = new Function(`return ${el.getAttribute(":rotation")}`);
    const vec = { x: 0, y: 0, z: 0, ...fn() };
    console.log(vec)
    mesh.rotation.set(vec.x, vec.y, vec.z);
  }

  if (el.getAttribute(":scale")) {
    const fn = new Function(`return ${el.getAttribute(":scale")}`);
    const vec = { x: 1, y: 1, z: 1, ...fn() };
    mesh.scale.set(vec.x, vec.y, vec.z);
  }
}
