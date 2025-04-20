import { MathsUtils } from "./maths/MathsUtils.js";

/**
 * @type {number}
 * @constant
 */
export const MIN_LOGICAL_WIDTH = 320;

/**
 * @type {number}
 * @constant
 */
export const MIN_LOGICAL_HEIGHT = 240;

/**
 * @type {number}
 * @constant
 */
export const MAX_LOGICAL_WIDTH = MathsUtils.shlmul(MIN_LOGICAL_WIDTH);

/**
 * @type {number}
 * @constant
 */
export const MAX_LOGICAL_HEIGHT = MathsUtils.shlmul(MIN_LOGICAL_HEIGHT);
