import { Point } from "./classes/point";
import { Camera } from "./classes/camera";
import { InputHandler } from "./classes/input-handler";
import { cube } from "./objects/cube";

let x = 'from "./classes/point"';

(function start() {
    const camera = new Camera(200, new Point(0, 0, 1), new Point(0, 1, 0));
    for (const triangle of cube) {
        camera.addObject(triangle);
    }
    new InputHandler(camera);
    camera.draw();
})();
