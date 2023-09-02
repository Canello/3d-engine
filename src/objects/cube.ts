import { Point } from "../classes/point";
import { Triangle } from "../classes/triangle";

export const cube = [
    // Front
    new Triangle([
        new Point(0, 200, 600),
        new Point(0, 0, 600),
        new Point(200, 0, 600),
    ]),
    new Triangle([
        new Point(0, 200, 600),
        new Point(200, 200, 600),
        new Point(200, 0, 600),
    ]),

    // Left
    new Triangle([
        new Point(200, 200, 800),
        new Point(200, 200, 600),
        new Point(200, 0, 600),
    ]),
    new Triangle([
        new Point(200, 200, 800),
        new Point(200, 0, 800),
        new Point(200, 0, 600),
    ]),

    // Top
    new Triangle([
        new Point(0, 200, 600),
        new Point(0, 200, 800),
        new Point(200, 200, 600),
    ]),
    new Triangle([
        new Point(0, 200, 800),
        new Point(200, 200, 800),
        new Point(200, 200, 600),
    ]),

    // Right
    new Triangle([
        new Point(0, 0, 600),
        new Point(0, 0, 800),
        new Point(0, 200, 600),
    ]),
    new Triangle([
        new Point(0, 200, 800),
        new Point(0, 0, 800),
        new Point(0, 200, 600),
    ]),

    // Bottom
    new Triangle([
        new Point(0, 0, 600),
        new Point(0, 0, 800),
        new Point(200, 0, 600),
    ]),
    new Triangle([
        new Point(200, 0, 800),
        new Point(0, 0, 800),
        new Point(200, 0, 600),
    ]),

    // Back
    new Triangle(
        [new Point(0, 0, 800), new Point(200, 0, 800), new Point(0, 200, 800)],
        "green",
    ),
    new Triangle(
        [
            new Point(0, 200, 800),
            new Point(200, 200, 800),
            new Point(200, 0, 800),
        ],
        "green",
    ),
];
