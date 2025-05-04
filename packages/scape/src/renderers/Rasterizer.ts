import type { Color } from "../common/Color.ts";
import { Vector3 } from "../maths/Vector3.ts";
import { CanvasUtils } from "./canvas/CanvasUtils.ts";

export interface RasterizerOptions {
	width?: number;
	height?: number;
	canvas?: HTMLCanvasElement;
}

export class Rasterizer {
	width: number;
	height: number;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	constructor(options: RasterizerOptions = {}) {
		this.width = options.width ?? globalThis.innerWidth;
		this.height = options.height ?? globalThis.innerHeight;

		this.canvas = options.canvas ?? CanvasUtils.createCanvasElement();
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.ctx = CanvasUtils.createCanvasRenderingContext2D(this.canvas, {
			willReadFrequently: true,
		});
		this.ctx.imageSmoothingEnabled = false;
	}

	clear(color: Color | string): this {
		const colorStr = typeof color === "string" ? color : `#${color.hexString}`;
		this.ctx.fillStyle = colorStr;
		this.ctx.fillRect(0, 0, this.width, this.height);
		return this;
	}

	drawLine(start: Vector3, end: Vector3, color: Color | string): this {
		const p1 = this.#projectToScreen(start);
		const p2 = this.#projectToScreen(end);

		const x1 = p1.x | 0;
		const y1 = p1.y | 0;
		const x2 = p2.x | 0;
		const y2 = p2.y | 0;

		const dx = Math.abs(x2 - x1);
		const dy = Math.abs(y2 - y1);
		const sx = x1 < x2 ? 1 : -1;
		const sy = y1 < y2 ? 1 : -1;
		let err = dx - dy;

		this.ctx.fillStyle = color.toString();

		let x = x1;
		let y = y1;

		while (true) {
			this.ctx.fillRect(x, y, 1, 1);

			if (x === x2 && y === y2) break;

			const e2 = err >> 1;
			if (e2 > -dy) {
				err -= dy;
				x += sx;
			}
			if (e2 < dx) {
				err += dx;
				y += sy;
			}
		}

		return this;
	}

	drawPoint(point: Vector3, color: Color): this {
		const screenPoint = this.#projectToScreen(point);
		const x = screenPoint.x | 0;
		const y = screenPoint.y | 0;

		this.ctx.fillStyle = color.toString();
		this.ctx.fillRect(x, y, 1, 1);

		return this;
	}

	drawTriangle(
		v1: Vector3,
		v2: Vector3,
		v3: Vector3,
		color: Color,
		wireframe = false,
	): this {
		const p1 = this.#projectToScreen(v1);
		const p2 = this.#projectToScreen(v2);
		const p3 = this.#projectToScreen(v3);

		const x1 = p1.x | 0;
		const y1 = p1.y | 0;
		const x2 = p2.x | 0;
		const y2 = p2.y | 0;
		const x3 = p3.x | 0;
		const y3 = p3.y | 0;

		const colorStr = color.toString();

		if (wireframe) {
			this.drawLine(v1, v2, colorStr);
			this.drawLine(v2, v3, colorStr);
			this.drawLine(v3, v1, colorStr);
		} else {
			// TODO(@KawaBaud): filled triangles pixel-perfect later
			this.ctx.fillStyle = colorStr;
			this.ctx.beginPath();
			this.ctx.moveTo(x1, y1);
			this.ctx.lineTo(x2, y2);
			this.ctx.lineTo(x3, y3);
			this.ctx.closePath();
			this.ctx.fill();
		}

		return this;
	}

	setSize(width: number, height: number): this {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx.imageSmoothingEnabled = false;
		return this;
	}

	#projectToScreen(point: Vector3): Vector3 {
		const x = (point.x + 1) * this.width / 2;
		const y = (-point.y + 1) * this.height / 2;
		return new Vector3(x, y, point.z);
	}
}
