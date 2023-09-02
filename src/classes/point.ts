export class Point {
    constructor(public x: number, public y: number, public z: number) {}

    public scale(s: number) {
        return new Point(this.x * s, this.y * s, this.z * s);
    }

    public rotate(axis: "x" | "y" | "z", angle: number) {
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

    public add(v: Point) {
        const x = this.x + v.x;
        const y = this.y + v.y;
        const z = this.z + v.z;
        return new Point(x, y, z);
    }

    public dotProduct(v: Point) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public crossProduct(v: Point) {
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;
        return new Point(x, y, z);
    }

    public unit() {
        const mod = (this.x ** 2 + this.y ** 2 + this.z ** 2) ** (1 / 2);
        const x = this.x / mod;
        const y = this.y / mod;
        const z = this.z / mod;
        return new Point(x, y, z);
    }

    public transform(func: (p: Point) => Point) {
        return func(this);
    }
}
