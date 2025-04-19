import { Maths } from "./maths/Maths.js";

/**
 * @readonly
 * @const {number}
 */
export const MIN_LOGICAL_WIDTH = 320;

/**
 * @readonly
 * @const {number}
 */
export const MIN_LOGICAL_HEIGHT = 240;

/**
 * @readonly
 * @const {number}
 */
export const MAX_LOGICAL_WIDTH = Maths.shlmul(MIN_LOGICAL_WIDTH);

/**
 * @readonly
 * @const {number}
 */
export const MAX_LOGICAL_HEIGHT = Maths.shlmul(MIN_LOGICAL_HEIGHT);
