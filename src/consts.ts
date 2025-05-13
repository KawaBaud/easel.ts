export const Side = {
	FRONT: 0,
	BACK: 1,
	DOUBLE: 2,
} as const;

export type Side = (typeof Side)[keyof typeof Side];
