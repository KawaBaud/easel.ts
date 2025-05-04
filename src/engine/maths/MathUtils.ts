export class MathUtils {
	static readonly EPSILON: number = 1e-4;

	static readonly TAU: number = 6.283185307179586;
	static readonly HALF_PI: number = 1.5707963267948966;

	static readonly RAD2DEG: number = 57.29577951308232;
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
