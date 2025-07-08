import type { Color } from "./common/Color";

export type ColorValue = string | number | Color;

export type Hsl = { h: number; s: number; l: number };
export type Rgb = { r: number; g: number; b: number };
export type Rgba = Rgb & { a: number };

export type HslArray = [h: number, s: number, l: number];
export type RgbArray = [r: number, g: number, b: number];
export type RgbaArray = [r: number, g: number, b: number, a: number];

/* const enum */
export const Side = {
	front: 0,
	back: 1,
	double: 2,
} as const;

export type Side = (typeof Side)[keyof typeof Side];
