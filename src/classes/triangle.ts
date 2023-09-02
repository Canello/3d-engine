import { Point } from "./point";

export class Triangle {
    constructor(public vertices: Array<Point>, public color: string = "red") {}

    public transform(func: (p: Point) => Point) {
        const newVertices = this.vertices.map((vertex) =>
            vertex.transform(func),
        );
        return new Triangle(newVertices, this.color);
    }
}
