import { Point } from "./point";
import { Triangle } from "./triangle";

export class WorldObject {
    constructor(public triangles: Array<Triangle>) {}

    transform(func: (p: Point) => Point) {
        const newTriangles = this.triangles.map((triangle) =>
            triangle.transform(func),
        );
        return new WorldObject(newTriangles);
    }
}
