import { Point } from "./point";
import { Display } from "./display";
import { Triangle } from "./triangle";

export class Camera {
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
        console.log(this.position);

        Display.clear();

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
