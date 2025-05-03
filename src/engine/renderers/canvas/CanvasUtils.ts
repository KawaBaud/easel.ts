import type { Camera } from "../../cameras/Camera.ts";
import { Vector3 } from "../../maths/Vector3.ts";
import type { Mesh } from "../../objects/Mesh.ts";
import { get } from "../../utils.ts";
import { RendererUtils } from "../RendererUtils.ts";

export class CanvasUtils {
	static renderMesh(
		context: CanvasRenderingContext2D,
		mesh: Mesh,
		camera: Camera,
		width: number,
		height: number,
	): void {
		const shape = mesh.shape;
		const material = mesh.material;

		const projectedVertices = shape.vertices.map((vertex) => {
			const worldVertex = new Vector3().copy(vertex);
			worldVertex.applyMatrix4(mesh.worldMatrix);
			return RendererUtils.projectVector(worldVertex, camera, width, height);
		});

		const colorHex = material.color.toString(16).padStart(6, "0");
		context.fillStyle = `#${colorHex}`;
		context.strokeStyle = `#${colorHex}`;

		for (let i = 0; i < shape.indices.length; i += 3) {
			const idx1 = get(shape.indices, i);
			const idx2 = get(shape.indices, i + 1);
			const idx3 = get(shape.indices, i + 2);

			const a = projectedVertices[idx1];
			const b = projectedVertices[idx2];
			const c = projectedVertices[idx3];

			if (!a || !b || !c) continue;

			const area = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
			if (area <= 0) continue;

			context.beginPath();
			context.moveTo(a.x, a.y);
			context.lineTo(b.x, b.y);
			context.lineTo(c.x, c.y);
			context.closePath();

			context.fill();
			if (material.wireframe) {
				context.strokeStyle = "#000000";
				context.stroke();
			}
		}

		if (mesh.name) {
			const position = new Vector3().copy(mesh.position);
			const projected = RendererUtils.projectVector(
				position,
				camera,
				width,
				height,
			);

			context.fillStyle = "white";
			context.font = "12px Arial";
			context.textAlign = "center";
			context.fillText(
				mesh.name,
				projected.x,
				projected.y + 20,
			);
		}
	}

	static setBackgroundColor(
		context: CanvasRenderingContext2D,
		width: number,
		height: number,
		color: string | number | null,
	): void {
		if (!color) return;

		if (typeof color === "string") {
			context.fillStyle = color;
		} else if (typeof color === "number") {
			context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
		}

		context.fillRect(0, 0, width, height);
	}

	static setCanvasSize(
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D,
		width: number,
		height: number,
		pixelRatio: number,
	): void {
		canvas.width = width * pixelRatio;
		canvas.height = height * pixelRatio;

		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		context.setTransform(
			pixelRatio,
			0,
			0,
			pixelRatio,
			0,
			0,
		);
	}
}
