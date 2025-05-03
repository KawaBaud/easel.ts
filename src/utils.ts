export function hexToRgb(hex: string): Array<number> {
	if (hex.length !== 6) return [0, 0, 0];

	const r = Number("0x" + hex.slice(0, 2));
	const g = Number("0x" + hex.slice(2, 4));
	const b = Number("0x" + hex.slice(4, 6));
	return [r, g, b];
}

export function hexToRgba(hex: string): Array<number> {
	if (hex.length !== 8 && hex.length !== 6) return [0, 0, 0, 255];

	const r = Number("0x" + hex.slice(0, 2));
	const g = Number("0x" + hex.slice(2, 4));
	const b = Number("0x" + hex.slice(4, 6));
	const a = hex.length === 8 ? Number("0x" + hex.slice(6, 8)) : 255;
	return [r, g, b, a];
}

export function rgbToHex(r: number, g: number, b: number): string {
	return "#" +
		((r & 0xFF).toString(16).padStart(2, "0") +
			(g & 0xFF).toString(16).padStart(2, "0") +
			(b & 0xFF).toString(16).padStart(2, "0")).toUpperCase();
}

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
	return "#" +
		((r & 0xFF).toString(16).padStart(2, "0") +
			(g & 0xFF).toString(16).padStart(2, "0") +
			(b & 0xFF).toString(16).padStart(2, "0") +
			(a & 0xFF).toString(16).padStart(2, "0")).toUpperCase();
}
