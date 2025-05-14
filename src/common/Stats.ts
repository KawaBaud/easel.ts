import { CanvasUtils } from "../renderers/CanvasUtils.ts";
import { Clock } from "./Clock.ts";

export class Stats {
	#container: HTMLDivElement;
	#clock: Clock;
	#prevTime: number;
	#frames: number;
	#fpsPanel: Panel;
	#msPanel: Panel;
	#memPanel: Panel | undefined;
	#lastTime = 0;

	constructor(clock = new Clock(true)) {
		this.#container = globalThis.document.createElement("div");
		this.#container.style.cssText =
			"position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
		this.#container.addEventListener("click", (event) => {
			event.preventDefault();
			this.#container.style.display = this.#container.style.display === "none"
				? "block"
				: "none";
		}, false);

		this.#clock = clock;
		this.#prevTime = 0;
		this.#frames = 0;

		this.#fpsPanel = this.#addPanel(new Panel("FPS", "#0ff", "#002"));
		this.#msPanel = this.#addPanel(new Panel("MS", "#0f0", "#020"));

		if (self.performance && "memory" in self.performance) {
			this.#memPanel = this.#addPanel(new Panel("MB", "#f08", "#201"));
		}
	}

	get dom(): HTMLDivElement {
		return this.#container;
	}

	end(): number {
		this.#frames++;

		const time = this.#clock.elapsedTime;
		const currentTime = performance.now();
		const frameDelta = currentTime - this.#lastTime;
		this.#lastTime = currentTime;

		this.#msPanel.update(frameDelta, 200);

		if (time >= this.#prevTime + 1) {
			this.#fpsPanel.update(
				(this.#frames) / (time - this.#prevTime),
				100,
			);
			this.#prevTime = time;
			this.#frames = 0;

			if (this.#memPanel && "memory" in performance) {
				const memory = (performance as Performance & {
					memory: { usedJSHeapSize: number; jsHeapSizeLimit: number };
				}).memory;
				this.#memPanel.update(
					memory.usedJSHeapSize / 1048576,
					memory.jsHeapSizeLimit / 1048576,
				);
			}
		}

		return time;
	}

	update(): void {
		this.end();
	}

	#addPanel(panel: Panel): Panel {
		this.#container.appendChild(panel.dom);
		return panel;
	}
}

class Panel {
	#name: string;
	#fg: string;
	#bg: string;
	#min = Infinity;
	#max = 0;
	#dom: HTMLCanvasElement;
	#ctx: CanvasRenderingContext2D;

	constructor(name: string, fg: string, bg: string) {
		this.#name = name;
		this.#fg = fg;
		this.#bg = bg;

		this.#dom = CanvasUtils.createCanvasElement();
		this.#dom.width = 80;
		this.#dom.height = 48;
		this.#dom.style.cssText = "width:80px;height:48px";

		this.#ctx = CanvasUtils.createCanvasRenderingContext2D(this.#dom);
		this.#ctx.font = "9px 'DotGothic16', monospace";
		this.#ctx.textBaseline = "top";

		this.#ctx.fillStyle = bg;
		this.#ctx.fillRect(0, 0, 80, 48);

		this.#ctx.fillStyle = fg;
		this.#ctx.fillText(name, 3, 3);
		this.#ctx.fillRect(3, 15, 74, 30);

		this.#ctx.fillStyle = bg;
		this.#ctx.globalAlpha = 0.9;
		this.#ctx.fillRect(3, 15, 74, 30);
	}

	get dom(): HTMLCanvasElement {
		return this.#dom;
	}

	update(value: number, maxValue: number): void {
		this.#min = Math.min(this.#min, value);
		this.#max = Math.max(this.#max, value);

		this.#ctx.fillStyle = this.#bg;
		this.#ctx.globalAlpha = 1;
		this.#ctx.fillRect(0, 0, 80, 15);

		this.#ctx.fillStyle = this.#fg;
		this.#ctx.fillText(`${Math.round(value)} ${this.#name}`, 3, 3);

		this.#ctx.drawImage(this.#dom, 3, 15, 74, 30, 3, 15, 74, 30);

		this.#ctx.fillStyle = this.#bg;
		this.#ctx.globalAlpha = 0.9;
		this.#ctx.fillRect(3, 15, 74, 30);

		this.#ctx.fillStyle = this.#fg;
		this.#ctx.fillRect(3, 15, Math.clamp((value / maxValue) * 74, 1, 74), 30);
	}
}
