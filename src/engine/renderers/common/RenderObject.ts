import type { Mesh } from "../../objects/Mesh.ts";

export interface RenderObject {
	object: Mesh;
	z: number;
}
