import type { Object3D } from "../objects/Object3D.ts";

export abstract class Loader<T extends Object3D = Object3D> {
	load(
		url: string,
		onLoad: (data: T) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (err: unknown) => void,
	): void {
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`failed to load file: ${response.statusText}`);
				}
				return response.text();
			})
			.then((text) => {
				onLoad(this.parse(text));
			})
			.catch(onError)
			.finally(() => {
				onProgress?.(new ProgressEvent("load"));
			});
	}

	abstract parse(text: string): T;
}
