import { Maths } from "./maths/Maths.js";

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
export const MAX_LOGICAL_WIDTH = Maths.shlmul(MIN_LOGICAL_WIDTH);

/**
 * @type {number}
 * @constant
 */
export const MAX_LOGICAL_HEIGHT = Maths.shlmul(MIN_LOGICAL_HEIGHT);
