import * as THREE from "three";
import { ThreeWebc } from "three-webc";

class Element extends ThreeWebc.Element {
  constructor() {
    super();
    const light = new THREE[this.getAttribute('type')]();
    this.light = light
  }

  async mounted({scene}) {
    scene.add( this.light );
  }
}

ThreeWebc.define("light", Element);
