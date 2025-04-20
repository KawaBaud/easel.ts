/**
 * @param {string} hex
 * @returns {Array<number>}
 */
export function hexToRgb(hex) {
    if (hex.length !== 6) return [0, 0, 0];

    const r = Number("0x" + hex.slice(0, 2));
    const g = Number("0x" + hex.slice(2, 4));
    const b = Number("0x" + hex.slice(4, 6));
    return [r, g, b];
}

/**
 * @param {string} hex
 * @returns {Array<number>}
 */
export function hexToRgba(hex) {
    if (hex.length !== 8 && hex.length !== 6) return [0, 0, 0, 255];

    const r = Number("0x" + hex.slice(0, 2));
    const g = Number("0x" + hex.slice(2, 4));
    const b = Number("0x" + hex.slice(4, 6));
    const a = hex.length === 8 ? Number("0x" + hex.slice(6, 8)) : 255;
    return [r, g, b, a];
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function rgbToHex(r, g, b) {
    return "#" +
        ((r & 0xFF).toString(16).padStart(2, "0") +
            (g & 0xFF).toString(16).padStart(2, "0") +
            (b & 0xFF).toString(16).padStart(2, "0")).toUpperCase();
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {string}
 */
export function rgbaToHex(r, g, b, a) {
    return "#" +
        ((r & 0xFF).toString(16).padStart(2, "0") +
            (g & 0xFF).toString(16).padStart(2, "0") +
            (b & 0xFF).toString(16).padStart(2, "0") +
            (a & 0xFF).toString(16).padStart(2, "0")).toUpperCase();
}
