export type ColorValue = string | number | Color;

export type HSL = [h: number, s: number, l: number];
export type RGB = [r: number, g: number, b: number];

export class Color {
	r = 1;
	g = 1;
	b = 1;

	constructor(...args: [color: ColorValue] | RGB) {
		if (args.length > 0) this.set(...args);
	}

	get hex(): number {
		return ((this.r * 255) << 16) ^
			(this.g * 255) << 8 ^
			(this.b * 255) << 0;
	}

	get hexString(): string {
		return `#${this.hex.toString(16).padStart(6, "0")}`;
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

	parse(value: ColorValue): this {
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

	set(...args: [color: ColorValue] | RGB): this {
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
		hex = hex | 0;

		this.r = (hex >> 16) / 255;
		this.g = (hex >> 8 & 255) / 255;
		this.b = (hex & 255) / 255;
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
		if (r > 255 || g > 255 || b > 255) {
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

	#parseRGB(style: string): this {
		const values = style.match(/\d+/g);
		if (!values || values.length < 3) {
			throw new Error(
				"EASEL.Color.#parseRGB(): rgb style must be in 'rgb(r,g,b)' or 'rgba(r,g,b,a)' format",
			);
		}

		return this.setRGB(
			Number(values[0]) / 255,
			Number(values[1]) / 255,
			Number(values[2]) / 255,
		);
	}
}
