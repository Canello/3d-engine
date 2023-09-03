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

    public q() {
        this.camera.rotate("y", 2);
    }

    public w() {
        this.camera.rotate("y", -2);
    }

    public a() {
        this.camera.rotate("x", 2);
    }

    public s() {
        this.camera.rotate("x", -2);
    }

    public z() {
        this.camera.rotate("z", 2);
    }

    public x() {
        this.camera.rotate("z", -2);
    }

    public ArrowUp() {
        this.camera.translate(0, 10, 0);
    }

    public ArrowDown() {
        this.camera.translate(0, -10, 0);
    }

    public ArrowRight() {
        this.camera.translate(-10);
    }

    public ArrowLeft() {
        this.camera.translate(10);
    }

    public Shift() {
        this.camera.translate(0, 0, 10);
    }

    public Control() {
        this.camera.translate(0, 0, -10);
    }
}
