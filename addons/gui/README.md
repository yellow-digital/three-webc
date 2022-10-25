

# Usage
```js
const { ObjectGui } = await import("three-webc/addons/gui/index.js");
const { GUI } = await import(
    "https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm"
);
const gui = new GUI();

// Add certain elements
new ObjectGui(document.querySelector('[gui]')).addTo(gui);
```