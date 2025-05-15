export {
	type ColorValue,
	type HSL,
	type HSLArray,
	type RGB,
	type RGBA,
	type RGBAArray,
	type RGBArray,
} from "./types/color.types.ts";

/* const enum */
export const Side = {
	FRONT: 0,
	BACK: 1,
	DOUBLE: 2,
} as const;

export type Side = (typeof Side)[keyof typeof Side];
