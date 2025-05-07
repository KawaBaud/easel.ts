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

	static fastAtan2(y: number, x: number): number {
		if (x === 0) return y > 0 ? MathUtils.HALF_PI : -MathUtils.HALF_PI;
		if (y === 0) return x >= 0 ? 0 : Math.PI;

		const absY = Math.abs(y);
		const absX = Math.abs(x);

		const inOctant = absY <= absX;

		const a = inOctant ? absY / absX : absX / absY;
		const s = a * a;
		let r = ((-0.046496 * s + 0.15931) * s - 0.32763) * s * a + a;

		if (!inOctant) r = MathUtils.HALF_PI - r;
		if (x < 0) r = Math.PI - r;
		if (y < 0) r = -r;

		return r;
	}

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
