export class RendererUtils {
	static sortVerticesByZ<T extends { z: number }>(vertices: T[]): T[] {
		return [...vertices].sort((a, b) => b.z - a.z);
	}

	static sortVerticesByY<T extends { y: number }>(vertices: T[]): T[] {
		return [...vertices].sort((a, b) => a.y - b.y);
	}
}
