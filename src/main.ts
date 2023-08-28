// NEXT STEPS
// 1) Account for movable camara

class Point {
    constructor(public x: number, public y: number, public z: number) {}
}

class Triangle {
    constructor(public vertices: Array<Point>, public color: string = "red") {}
}

class Camera {
    private position: Point;
    private normal: Point;
    private objects: Array<Triangle>;

    constructor() {
        this.position = new Point(0, 0, 0);
        this.normal = new Point(0, 0, 20);
        this.objects = [];
    }

    public addObject(object: Triangle) {
        this.objects.push(object);
    }

    public draw() {
        const objectsOnScreen = this.projectObjectsOnScreen();

        for (const object of objectsOnScreen) {
            Display.stroke(object);
        }
    }

    private projectObjectsOnScreen() {
        const projections: Array<Triangle> = [];

        for (const object of this.objects) {
            const projection = this.projectObjectOnScreen(object);
            projections.push(projection);
        }

        return projections;
    }

    private projectObjectOnScreen(object: Triangle) {
        const objectVertices = object.vertices;
        const projectionVertices = [];

        for (const objectVertex of objectVertices) {
            const projectionVertex = this.projectPointOnScreen(objectVertex);
            projectionVertices.push(projectionVertex);
        }

        console.log(object.vertices);
        console.log(projectionVertices);

        return new Triangle(projectionVertices, object.color);
    }

    private projectPointOnScreen(point: Point) {
        const { x: a, y: b, z: c } = this.normal;
        const d =
            this.normal.x * (this.position.x + this.normal.x) +
            this.normal.y * (this.position.y + this.normal.y) +
            this.normal.z * (this.position.z + this.normal.z);

        const alfaX = point.x - this.position.x;
        const alfaY = point.y - this.position.y;
        const alfaZ = point.z - this.position.z;

        const t =
            (d -
                a * this.position.x -
                b * this.position.y -
                c * this.position.z) /
            (a * alfaX + b * alfaY + c * alfaZ);

        const projectionX = this.position.x + alfaX * t;
        const projectionY = this.position.y + alfaY * t;
        const projectionZ = this.position.z + alfaZ * t;

        return new Point(projectionX, projectionY, projectionZ);
    }
}

class Display {
    private static screen = document.querySelector(
        "canvas",
    ) as HTMLCanvasElement;
    private static c = Display.screen.getContext("2d")!;

    static get width() {
        return Display.screen.width;
    }

    static get height() {
        return Display.screen.height;
    }

    static stroke(object: Triangle) {
        this.drawAxis();

        const c = Display.c;
        const screenObject = this.toScreenCoordinates(object);
        c.strokeStyle = screenObject.color;
        c.beginPath();
        c.moveTo(screenObject.vertices[0].x, screenObject.vertices[0].y);
        c.lineTo(screenObject.vertices[1].x, screenObject.vertices[1].y);
        c.lineTo(screenObject.vertices[2].x, screenObject.vertices[2].y);
        c.lineTo(screenObject.vertices[0].x, screenObject.vertices[0].y);
        c.stroke();
    }

    // Assuming that the object received is already on the screen plane
    private static toScreenCoordinates(object: Triangle) {
        const { width, height } = Display.screen;
        const verticesOnScreenCoordinates: Array<Point> = [];

        for (const vertex of object.vertices) {
            const x = width / 2 + vertex.x;
            const y = height / 2 - vertex.y;
            const point = new Point(x, y, 0); // Arbitrary z value, as screen coordinates only have x and y
            verticesOnScreenCoordinates.push(point);
        }

        return new Triangle(verticesOnScreenCoordinates, object.color);
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

(function t() {
    const triangle = new Triangle([
        new Point(0, 200, 75),
        new Point(200, 200, 100),
        new Point(200, 0, 100),
    ]);
    const camera = new Camera();
    camera.addObject(triangle);
    camera.draw();
})();
