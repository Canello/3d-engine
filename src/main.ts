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

        console.log(point.x, point.y, point.z);
        console.log(projectionX, projectionY, projectionZ);

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
        const c = Display.c;
        c.fillStyle = object.color;
        c.beginPath();
        c.moveTo(object.vertices[0].x, object.vertices[0].y);
        c.lineTo(object.vertices[1].x, object.vertices[1].y);
        c.lineTo(object.vertices[2].x, object.vertices[2].y);
        c.lineTo(object.vertices[0].x, object.vertices[0].y);
        c.stroke();
    }
}

(function t() {
    const triangle = new Triangle([
        new Point(0, 200, 100),
        new Point(200, 200, 100),
        new Point(200, 0, 100),
    ]);
    const camera = new Camera();
    camera.addObject(triangle);
    camera.draw();
})();
