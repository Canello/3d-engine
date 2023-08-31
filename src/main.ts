// NEXT STEPS
// 1) Listen to keyboard
// 2) Add animation to camera movement

class Point {
    constructor(public x: number, public y: number, public z: number) {}

    scale(s: number) {
        return new Point(this.x * s, this.y * s, this.z * s);
    }

    rotate(axis: "x" | "y" | "z", angle: number) {
        const radians = (angle * Math.PI) / 180;
        const cos = +Math.cos(radians).toFixed(5);
        const sin = +Math.sin(radians).toFixed(5);

        if (axis === "x") {
            const y = cos * this.y - sin * this.z;
            const z = sin * this.y + cos * this.z;
            return new Point(this.x, y, z);
        } else if (axis === "y") {
            const x = cos * this.x + sin * this.z;
            const z = -sin * this.x + cos * this.z;
            return new Point(x, this.y, z);
        } else {
            const x = cos * this.x - sin * this.y;
            const y = sin * this.x + cos * this.y;
            return new Point(x, y, this.z);
        }
    }

    add(v: Point) {
        const x = this.x + v.x;
        const y = this.y + v.y;
        const z = this.z + v.z;
        return new Point(x, y, z);
    }

    dotProduct(v: Point) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    crossProduct(v: Point) {
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;
        return new Point(x, y, z);
    }

    unit() {
        const mod = (this.x ** 2 + this.y ** 2 + this.z ** 2) ** (1 / 2);
        const x = this.x / mod;
        const y = this.y / mod;
        const z = this.z / mod;
        return new Point(x, y, z);
    }
}

class Triangle {
    constructor(public vertices: Array<Point>, public color: string = "red") {}
}

class Camera {
    private position: Point;
    private normal: Point; // Normal vector of screen plane
    private i: Point; // Unit vector of screen plane x axis
    private j: Point; // Unit vector of screen plane y axis
    private screenDistance: number;
    private objects: Array<Triangle>;

    constructor(
        screenDistance: number = 50,
        normal: Point = new Point(0, 0, 1),
        j: Point = new Point(0, 1, 0),
    ) {
        this.position = new Point(0, 0, 0);
        this.normal = normal.unit();
        this.j = j.unit();
        this.i = this.normal.crossProduct(this.j);
        this.screenDistance = screenDistance;
        this.objects = [];
    }

    public addObject(object: Triangle) {
        this.objects.push(object);
    }

    public translate(dx: number = 0, dy: number = 0, dz: number = 0) {
        this.position = new Point(
            this.position.x + dx,
            this.position.y + dy,
            this.position.z + dz,
        );
    }

    public rotate(axis: "x" | "y" | "z", angle: number) {
        this.normal = this.normal.rotate(axis, angle);
        this.j = this.j.rotate(axis, angle);
        this.i = this.normal.crossProduct(this.j);
    }

    public draw() {
        const objectsOnScreen = this.projectObjectsOnScreen(); // Objects projected on screen but on global coordinates
        const objectsOnScreenCoordinates =
            this.objectsToScreenPlaneCoordinates(objectsOnScreen); // Objects on screen's x, y coordinates

        for (const object of objectsOnScreenCoordinates) {
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
        const {
            x: xScreenOrigin,
            y: yScreenOrigin,
            z: zScreenOrigin,
        } = this.normal.scale(this.screenDistance);
        const { x: a, y: b, z: c } = this.normal;
        const d =
            this.normal.x * (this.position.x + xScreenOrigin) +
            this.normal.y * (this.position.y + yScreenOrigin) +
            this.normal.z * (this.position.z + zScreenOrigin);

        const alfaX = point.x - this.position.x;
        const alfaY = point.y - this.position.y;
        const alfaZ = point.z - this.position.z;

        const t =
            (d -
                a * this.position.x -
                b * this.position.y -
                c * this.position.z) /
            (a * alfaX + b * alfaY + c * alfaZ);

        const xProjection = this.position.x + alfaX * t;
        const yProjection = this.position.y + alfaY * t;
        const zProjection = this.position.z + alfaZ * t;

        return new Point(xProjection, yProjection, zProjection);
    }

    private objectsToScreenPlaneCoordinates(objects: Array<Triangle>) {
        const objectsInScreenPlaneCoordinates: Array<Triangle> = [];

        for (const object of objects) {
            const objectInScreenPlaneCoordinates =
                this.objectToScreenPlaneCoordinates(object);
            objectsInScreenPlaneCoordinates.push(
                objectInScreenPlaneCoordinates,
            );
        }

        return objectsInScreenPlaneCoordinates;
    }

    private objectToScreenPlaneCoordinates(object: Triangle) {
        const verticesInScreenPlaneCoordinates: Array<Point> = [];

        for (const vertex of object.vertices) {
            const vertexInScreenPlaneCoordinates =
                this.toScreenPlaneCoordinates(vertex);
            verticesInScreenPlaneCoordinates.push(
                vertexInScreenPlaneCoordinates,
            );
        }

        return new Triangle(verticesInScreenPlaneCoordinates, object.color);
    }

    private toScreenPlaneCoordinates(point: Point) {
        const screenOrigin = this.position.add(
            this.normal.scale(this.screenDistance),
        );
        const p = screenOrigin.scale(-1).add(point);

        const x = p.dotProduct(this.i);
        const y = p.dotProduct(this.j);

        return new Point(x, y, 0); // Arbitrary z value, as canvas coordinates only have x and y
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

(function t() {
    const triangle = new Triangle([
        new Point(0, 200, 100),
        new Point(200, 200, 100),
        new Point(200, 0, 100),
    ]);
    const camera = new Camera(50, new Point(0, 0, 1), new Point(0, 1, 0));
    camera.addObject(triangle);
    camera.draw();
    setTimeout(() => {
        camera.rotate("y", 90);
        camera.draw();
    }, 1000);
})();
