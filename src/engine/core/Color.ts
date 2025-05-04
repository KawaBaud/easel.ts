import type { Cloneable, Copyable } from "../types/interfaces.ts";

export class Color implements Cloneable<Color>, Copyable<Color> {
	readonly isColor: boolean = true;

	constructor(
		public r = 1,
		public g = 1,
		public b = 1,
	) {}

	get hex(): number {
		return (this.r * 255) << 16 | (this.g * 255) << 8 | (this.b * 255);
	}

	get hexStyle(): string {
		return `#${this.hex.toString(16).padStart(6, "0")}`;
	}

	get rgb(): number[] {
		return [this.r, this.g, this.b];
	}

	get rgbStyle(): string {
		return `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})`;
	}

	get hsl(): number[] {
		const { r, g, b } = this;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const l = (max + min) / 2;

		if (max === min) return [0, 0, l];

		const d = max - min;
		const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		let h = 0;
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		return [(h / 6) * 360, s * 100, l * 100];
	}

	get hslStyle(): string {
		const [h, s, l] = this.hsl;
		return `hsl(${h}, ${s}%, ${l}%)`;
	}

	clone(): Color {
		return new Color(this.r, this.g, this.b);
	}

	copy(source: Color): Color {
		this.r = source.r;
		this.g = source.g;
		this.b = source.b;
		return this;
	}

	set(r: number | string | Color, g?: number, b?: number): this {
		if (g === undefined && b === undefined) {
			const value = r;

			if (typeof value === "object" && "isColor" in value) {
				this.copy(value);
			} else if (typeof value === "number") {
				this.setHex(value);
			} else if (typeof value === "string") {
				this.setStyle(value);
			}
		} else if (typeof r === "number") {
			this.setRGB(r, g ?? 1, b ?? 1);
		}

		return this;
	}

	setHex(hex: number): this {
		if (hex > 0xFFFFFF || hex < 0) {
			throw new Error("Color: hex value out of range");
		}

		hex = Math.floor(hex);

		this.r = (hex >> 16) / 255;
		this.g = (hex >> 8 & 255) / 255;
		this.b = (hex & 255) / 255;

		return this;
	}

	setRGB(r: number, g: number, b: number): this {
		if (r > 255 || g > 255 || b > 255) {
			throw new Error("Color: rgb value out of range");
		}

		this.r = r;
		this.g = g;
		this.b = b;
		return this;
	}

	setStyle(style: string): this {
		style = style.toLowerCase();
		if (style.startsWith("#")) return this.#parseHex(style);
		if (style.startsWith("rgb")) return this.#parseRGB(style);
		if (style.startsWith("hsl")) return this.#parseHSL(style);
		throw new Error("Color: invalid style");
	}

	#parseHex(style: string): this {
		if (style.length !== 7) {
			throw new Error("Color: hex style must be in '#rrggbb' format");
		}
		this.setHex(parseInt(style.slice(1), 16));
		return this;
	}

	#parseRGB(style: string): this {
		const values = style.match(/\d+/g);
		if (!values || values.length < 3) {
			throw new Error(
				"Color: rgb(a) style must be in 'rgb(r,g,b)' or 'rgba(r,g,b,a)' format",
			);
		}
		this.setRGB(
			Number(values[0]) / 255,
			Number(values[1]) / 255,
			Number(values[2]) / 255,
		);
		return this;
	}

	#parseHSL(style: string): this {
		const values = style.match(/\d+/g);
		if (!values || values.length < 3) {
			throw new Error(
				"Color: hsl(a) style must be in 'hsl(h,s%,l%)' or 'hsla(h,s%,l%,a)' format",
			);
		}
		const h = Number(values[0]) / 360;
		const s = Number(values[1]) / 100;
		const l = Number(values[2]) / 100;

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		const hueToRGB = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		this.r = hueToRGB(p, q, h + 1 / 3);
		this.g = hueToRGB(p, q, h);
		this.b = hueToRGB(p, q, h - 1 / 3);
		return this;
	}
}
