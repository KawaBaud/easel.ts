export abstract class Processor {
	enabled = true;

	dispose(): void {}

	init(): void {
	}

	reset(): this {
		return this;
	}

	setEnabled(value: boolean): this {
		this.enabled = value;
		return this;
	}

	update(_dt: number): this {
		return this;
	}
}
