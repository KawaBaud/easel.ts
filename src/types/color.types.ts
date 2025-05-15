import type { Color } from "../common/Color.ts";

export type ColorValue = string | number | Color;

export type HSL = {
	h: number;
	s: number;
	l: number;
};
export type RGB = {
	r: number;
	g: number;
	b: number;
};
export type RGBA = RGB & { a: number };

export type HSLArray = [h: number, s: number, l: number];
export type RGBArray = [r: number, g: number, b: number];
export type RGBAArray = [r: number, g: number, b: number, a: number];
