export const isColor = (value) => value && typeof value === "object" && value.r;

function addFolderListeners(folder) {
  const trigger = folder.domElement.querySelector(".title");
  trigger.addEventListener("click", (e) => {
    const isOpen = !folder._closed;
    if (isOpen) {
      folder.domElement.dispatchEvent(
        new CustomEvent("open", {
          bubbles: true,
          detail: folder,
        })
      );
    }
    if (!isOpen) {
      folder.domElement.dispatchEvent(
        new CustomEvent("close", {
          bubbles: true,
          detail: folder,
        })
      );
    }
  });
}

/**
 * @example: new ObjectGui(scene).addTo(gui);
 */
export class ObjectGui {
  constructor(object = {}, { recursive = true } = {}) {
    this.object = object || {};
    this.recursive = recursive;
    this.folder = null;
    this.controllers = null;
  }

  addTo(folder = {}) {
    this.folder = folder;

    folder.domElement.dispatchEvent(
      new CustomEvent("before", {
        bubbles: true,
        detail: this,
      })
    );

    const { object } = this;

    // THREE JS specials
    if (object.removeFromParent) {
      const controller = {
        remove() {
          object.removeFromParent();
          folder.destroy();
        },
      };
      folder.add(controller, "remove");
    }

    // Add all props
    let keys = Object.entries(object);

    const controllers = keys.map(([key, value]) => {
      // Detect recursion?
      if (key === "parent") {
        console.warn("skipped");
        return;
      }
      if (value === null) {
        // Skip null
        return;
      }
      if (isColor(value)) {
        return folder.addColor(object, key);
      }
      // New Folder
      if (value && typeof value === "object" && this.recursive) {
        const newFolder = folder.addFolder(value.name || key).open(false);
        newFolder.domElement.querySelector(".title").innerHTML = `
      <div class="label">${value.name || key}</div>
      <l-spacer></l-spacer><small>${value.type || value.mime || ""}</small>`;

        addFolderListeners(newFolder);
        newFolder.domElement.addEventListener("open", (e) => {
          e.stopPropagation();

          const newController = new ObjectGui(value).addTo(newFolder);
        });
        newFolder.domElement.addEventListener("close", (e) => {
          e.stopPropagation();
          Array.from(newFolder.children).forEach((c) => c.destroy());
        });
        return newFolder;
      }
      if (typeof value === "string") {
        return folder.add(object, key);
      }
      if (typeof value === "number") {
        return folder.add(object, key).step((value <= 1 && 0.1) || 1);
      }
      // default input, ...
      return folder.add(object, key);
    });
    this.controllers = controllers;

    folder.domElement.dispatchEvent(
      new CustomEvent("after", {
        bubbles: true,
        detail: folder,
      })
    );

    return this;
  }
}

customElements.define("l-spacer", class extends HTMLElement {});

const style = `
l-spacer {
  flex-grow: 1;
}
.lil-gui .title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  width: 100%;
}
`;

var styleNode = document.createElement("style");
var styleText = document.createTextNode(style);
styleNode.appendChild(styleText);
document.getElementsByTagName("head")[0].appendChild(styleNode);

export class StatsGui {
  async addTo(folder) {
    const Stats = await import(
      "//mrdoob.github.io/stats.js/build/stats.module.js"
    ).then((e) => e.default);

    const target = folder.domElement // document.body
    {
      var stats = new Stats();
      stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      target.appendChild(stats.dom);
      stats.domElement.style.position = "inherit";
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop);
      });
    }
  }
}
