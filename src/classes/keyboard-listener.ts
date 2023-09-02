export class KeyboardListener {
    private observers: Array<any>;

    constructor() {
        this.observers = [];
        this.listen();
    }

    public subscribe(f: Function | Array<Function>) {
        if (typeof f === "function") {
            this.observers.push(f);
            return;
        }
        for (const func of f) {
            this.observers.push(func);
        }
    }

    private listen() {
        document.addEventListener("keydown", (event) => {
            this.notifyAll(event.key);
        });
    }

    private notifyAll(key: string) {
        for (const observer of this.observers) {
            observer(key);
        }
    }
}
