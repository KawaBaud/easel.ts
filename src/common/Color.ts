import { MathUtils } from "../maths/MathUtils.ts";

export type ColorType = string | number | Color;

export type HSL = {
	h: number;
	s: number;
	l: number;
};
export type HSLArray = [h: number, s: number, l: number];
export type RGB = {
	r: number;
	g: number;
	b: number;
};
export type RGBA = RGB & { a: number };
export type RGBArray = [r: number, g: number, b: number];

export class Color {
	static readonly HUE_SCALE = 360;
	static readonly SATURATION_SCALE = 100;
	static readonly LIGHTNESS_SCALE = 100;

	static readonly RGB_SCALE = 255;

	static toRGB(color: ColorType): RGB {
		const tempColor = new Color(color);
		return {
			r: MathUtils.fastTrunc(tempColor.r * Color.RGB_SCALE),
			g: MathUtils.fastTrunc(tempColor.g * Color.RGB_SCALE),
			b: MathUtils.fastTrunc(tempColor.b * Color.RGB_SCALE),
		};
	}

	r = 1;
	g = 1;
	b = 1;

	constructor(...args: [color: ColorType] | RGBArray) {
		args.length > 0 ? this.set(...args) : (this.r = this.g = this.b = 0);
	}

	get hex(): number {
		return ((this.r * Color.RGB_SCALE) << 16) ^
			((this.g * Color.RGB_SCALE) << 8) ^
			((this.b * Color.RGB_SCALE) << 0);
	}

	get hexString(): string {
		return `#${this.hex.toString(16).padStart(6, "0")}`;
	}

	get hsl(): HSL {
		const r = this.r;
		const g = this.g;
		const b = this.b;

		const max = MathUtils.fastMax(MathUtils.fastMax(r, g), b);
		const min = MathUtils.fastMin(MathUtils.fastMin(r, g), b);

		let h = 0, s = 0;
		const l = (min + max) / 2;

		if (min !== max) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			h = (max === r)
				? ((g - b) / d + (g < b ? 6 : 0))
				: (max === g)
				? ((b - r) / d + 2)
				: ((r - g) / d + 4);
			h /= 6;
		}

		return { h, s, l };
	}

	get hslString(): string {
		const hsl = this.hsl;

		const h = MathUtils.fastTrunc(hsl.h * Color.HUE_SCALE);
		const s = MathUtils.fastTrunc(hsl.s * Color.SATURATION_SCALE);
		const l = MathUtils.fastTrunc(hsl.l * Color.LIGHTNESS_SCALE);
		return `hsl(${h},${s}%,${l}%)`;
	}

	clone(): Color {
		return new Color(this);
	}

	copy(source: Color): this {
		this.r = source.r;
		this.g = source.g;
		this.b = source.b;
		return this;
	}

	parse(value: ColorType): this {
		if (value instanceof Color) {
			this.copy(value);
			return this;
		} else if (typeof value === "number") {
			return this.setHex(value);
		} else if (typeof value === "string") {
			return this.setStyle(value);
		}

		throw new Error(`EASEL.Color.parse(): invalid value: ${value}`);
	}

	set(...args: [color: ColorType] | RGBArray): this {
		if (args.length === 1) {
			const value = args[0];

			if (value instanceof Color) {
				this.copy(value);
			} else if (typeof value === "number") {
				this.setHex(value);
			} else if (typeof value === "string") {
				this.setStyle(value);
			}
		} else if (args.length === 3) {
			this.setRGB(args[0], args[1], args[2]);
		}

		return this;
	}

	setHex(hex: number): this {
		if (hex > 0xFFFFFF || hex < 0) {
			throw new Error("EASEL.Color.setHex(): hex out of range");
		}
		hex = MathUtils.fastTrunc(hex);

		this.r = (hex >> 16) / Color.RGB_SCALE;
		this.g = (hex >> 8 & Color.RGB_SCALE) / Color.RGB_SCALE;
		this.b = (hex & Color.RGB_SCALE) / Color.RGB_SCALE;
		return this;
	}

	setHSL(h: number, s: number, l: number): this {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		if (s === 0) {
			this.r = this.g = this.b = l;
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			this.r = hue2rgb(p, q, h + 1 / 3);
			this.g = hue2rgb(p, q, h);
			this.b = hue2rgb(p, q, h - 1 / 3);
		}

		return this;
	}

	setRGB(r: number, g: number, b: number): this {
		if (r > Color.RGB_SCALE || g > Color.RGB_SCALE || b > Color.RGB_SCALE) {
			throw new Error("EASEL.Color.setRGB(): rgb out of range");
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

		throw new Error(`EASEL.Color.setStyle(): invalid style: ${style}`);
	}

	#parseHex(style: string): this {
		if (style.length !== 7) {
			throw new Error(
				"EASEL.Color.#parseHex(): hex style must be in '#rrggbb' format",
			);
		}

		return this.setHex(parseInt(style.slice(1), 16));
	}

	#parseHSL(style: string): this {
		const values = style.match(/\d+/g);
		if (!values || values.length < 3) {
			throw new Error(
				"EASEL.Color.#parseHSL(): hsl(a) style must be in 'hsl(h,s%,l%)' or 'hsla(h,s%,l%,a)' format",
			);
		}

		const h = Number(values[0]) / Color.HUE_SCALE;
		const s = Number(values[1]) / Color.SATURATION_SCALE;
		const l = Number(values[2]) / Color.LIGHTNESS_SCALE;

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

	#parseRGB(style: string): this {
		const values = style.match(/\d+/g);
		if (!values || values.length < 3) {
			throw new Error(
				"EASEL.Color.#parseRGB(): rgb style must be in 'rgb(r,g,b)' or 'rgba(r,g,b,a)' format",
			);
		}

		return this.setRGB(
			Number(values[0]) / Color.RGB_SCALE,
			Number(values[1]) / Color.RGB_SCALE,
			Number(values[2]) / Color.RGB_SCALE,
		);
	}
}
