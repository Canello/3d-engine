import { Point } from "./point";
import { Triangle } from "./triangle";
import { WorldObject } from "./world-object";

export class Display {
    private static screen = document.querySelector(
        "canvas",
    ) as HTMLCanvasElement;
    private static c = Display.screen.getContext("2d")!;

    public static clear() {
        Display.c.clearRect(0, 0, screen.width, screen.height);
        Display.drawAxis();
    }

    public static stroke(object: WorldObject) {
        for (const triangle of object.triangles) {
            Display.strokeTriangle(triangle);
        }
    }

    private static strokeTriangle(triangle: Triangle) {
        const c = Display.c;
        const canvasTriangle = triangle.transform(
            this.toCanvasCoordinates.bind(this),
        );
        c.strokeStyle = canvasTriangle.color;
        c.beginPath();
        c.moveTo(canvasTriangle.vertices[0].x, canvasTriangle.vertices[0].y);
        c.lineTo(canvasTriangle.vertices[1].x, canvasTriangle.vertices[1].y);
        c.lineTo(canvasTriangle.vertices[2].x, canvasTriangle.vertices[2].y);
        c.lineTo(canvasTriangle.vertices[0].x, canvasTriangle.vertices[0].y);
        c.stroke();
    }

    private static toCanvasCoordinates(point: Point) {
        // point must be on the screen plane
        const { width, height } = Display.screen;
        const x = width / 2 + point.x;
        const y = height / 2 - point.y;
        return new Point(x, y, 0); // Arbitrary z value, as canvas coordinates only have x and y
    }

    private static drawAxis() {
        const c = Display.c;
        const { width, height } = Display.screen;
        const [xOrigin, yOrigin] = [width / 2, height / 2];
        c.strokeStyle = "black";
        c.beginPath();
        c.moveTo(xOrigin, yOrigin);
        c.lineTo(xOrigin + width, yOrigin);
        c.moveTo(xOrigin, yOrigin);
        c.lineTo(xOrigin - width, yOrigin);
        c.moveTo(xOrigin, yOrigin);
        c.lineTo(xOrigin, yOrigin + height);
        c.moveTo(xOrigin, yOrigin);
        c.lineTo(xOrigin, yOrigin - height);
        c.stroke();
    }
}
