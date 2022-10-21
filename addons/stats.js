import Stats from "three/addons/libs/stats.module.js";
import { ThreeWebc } from "three-webc";

ThreeWebc.define(
	"stats",
	class extends ThreeWebc.Element {
		mounted() {
			const stats = new Stats();
			this.appendChild(stats.dom);

			this.stats = stats
		}

		tick() {
			this.stats.update()
		}

		destroyed() {
			
		}
	}
);
