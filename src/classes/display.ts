import { Point } from "./point";
import { Triangle } from "./triangle";

export class Display {
    private static screen = document.querySelector(
        "canvas",
    ) as HTMLCanvasElement;
    private static c = Display.screen.getContext("2d")!;

    public static get width() {
        return Display.screen.width;
    }

    public static get height() {
        return Display.screen.height;
    }

    public static clear() {
        Display.c.clearRect(0, 0, screen.width, screen.height);
        Display.drawAxis();
    }

    public static stroke(object: Triangle) {
        const c = Display.c;
        const canvasObject = this.toCanvasCoordinates(object);
        c.strokeStyle = canvasObject.color;
        c.beginPath();
        c.moveTo(canvasObject.vertices[0].x, canvasObject.vertices[0].y);
        c.lineTo(canvasObject.vertices[1].x, canvasObject.vertices[1].y);
        c.lineTo(canvasObject.vertices[2].x, canvasObject.vertices[2].y);
        c.lineTo(canvasObject.vertices[0].x, canvasObject.vertices[0].y);
        c.stroke();
    }

    private static toCanvasCoordinates(object: Triangle) {
        // object must be on the screen plane
        const { width, height } = Display.screen;
        const verticesOnCanvasCoordinates: Array<Point> = [];

        for (const vertex of object.vertices) {
            const x = width / 2 + vertex.x;
            const y = height / 2 - vertex.y;
            const point = new Point(x, y, 0); // Arbitrary z value, as canvas coordinates only have x and y
            verticesOnCanvasCoordinates.push(point);
        }

        return new Triangle(verticesOnCanvasCoordinates, object.color);
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
