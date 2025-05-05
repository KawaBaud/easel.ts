export class MathUtils {
	static readonly EPSILON: number = 1e-4;

	/** 2 * Math.PI */
	static readonly TAU: number = 6.283185307179586;

	/** Math.PI / 2 */
	static readonly HALF_PI: number = 1.5707963267948966;

	/** Math.PI / 4 */
	static readonly QUARTER_PI: number = 0.7853981633974483;

	/** 180 / Math.PI */
	static readonly RAD2DEG: number = 57.29577951308232;

	/** Math.PI / 180 */
	static readonly DEG2RAD: number = 0.017453292519943295;

	static clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(value, max));
	}

	static safeAsin(value: number): number {
		return Math.asin(MathUtils.clamp(value, -1, 1));
	}

	static toDegrees(radians: number): number {
		return radians * MathUtils.RAD2DEG;
	}

	static toRadians(degrees: number): number {
		return degrees * MathUtils.DEG2RAD;
	}
}
