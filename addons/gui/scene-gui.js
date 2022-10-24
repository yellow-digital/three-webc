import {ObjectGui} from "./GuiHelpers.js";
import { ThreeWebc } from "three-webc";

class Element extends ThreeWebc.Element {
  async mounted() {
    const {scene} = this;

    const { GUI } = await import("https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm");
    const gui = new GUI();

    const folder = gui.addFolder("scene").open(false);
    this.controller = new ObjectGui(scene).addTo(folder)
  }
}

ThreeWebc.define(
  "scene-gui",
  Element
);
