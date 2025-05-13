export class Clock {
	#autoStart: boolean;
	#startTime = 0;
	#oldTime = 0;
	#elapsedTime = 0;
	#running = false;

	constructor(autoStart = true) {
		this.#autoStart = autoStart;
	}

	get elapsedTime(): number {
		this.delta;
		return this.#elapsedTime;
	}

	get delta(): number {
		let diff = 0;

		if (this.#autoStart && !this.#running) {
			this.start();
			return 0;
		}

		if (this.#running) {
			const newTime = now();

			diff = (newTime - this.#oldTime) / 1000;
			this.#oldTime = newTime;

			this.#elapsedTime += diff;
		}

		return diff;
	}

	start(): void {
		this.#startTime = now();
		this.#oldTime = this.#startTime;
		this.#elapsedTime = 0;
		this.#running = true;
	}

	stop(): void {
		this.elapsedTime;
		this.#running = false;
		this.#autoStart = false;
	}
}

function now(): number {
	return (typeof performance === "undefined" ? Date : performance).now();
}
