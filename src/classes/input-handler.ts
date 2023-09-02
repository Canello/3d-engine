import { Camera } from "./camera";
import { KeyboardListener } from "./keyboard-listener";

export class InputHandler {
    keyboardListener: KeyboardListener;
    [key: string]: any;

    constructor(private camera: Camera) {
        this.keyboardListener = new KeyboardListener();
        this.keyboardListener.subscribe(this.handleKeyboardInput.bind(this));
    }

    private handleKeyboardInput(key: string) {
        if (typeof this[key] === "function") {
            this[key]();
            this.camera.draw();
        }
    }

    q() {
        this.camera.rotate("y", 2);
    }

    w() {
        this.camera.rotate("y", -2);
    }

    a() {
        this.camera.rotate("x", 2);
    }

    s() {
        this.camera.rotate("x", -2);
    }

    z() {
        this.camera.rotate("z", 2);
    }

    x() {
        this.camera.rotate("z", -2);
    }

    ArrowUp() {
        this.camera.translate(0, 10, 0);
    }

    ArrowDown() {
        this.camera.translate(0, -10, 0);
    }

    ArrowRight() {
        this.camera.translate(-10);
    }

    ArrowLeft() {
        this.camera.translate(10);
    }

    Shift() {
        this.camera.translate(0, 0, 10);
    }

    Control() {
        this.camera.translate(0, 0, -10);
    }
}
