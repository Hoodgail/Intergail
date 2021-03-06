import InterElement from "../core/InterElement";
import Scene from "../core/Scene";
import Vector2 from "../math/Vector2";

export default class InterRenderer {

    public mouse: Vector2 = new Vector2();
    public calls: number = 0;

    private _context: CanvasRenderingContext2D | null = null;

    public canvas: HTMLCanvasElement = document.createElement("canvas");

    public get context(): CanvasRenderingContext2D | null {
        if (this._context !== null) return this._context;

        this._context = this.canvas.getContext("2d")
        return this._context;
    }

    constructor() {
        this.canvas.addEventListener("mousemove", (event: MouseEvent) => this.mousemove(event))
    }

    mousemove(event: MouseEvent) {
        // important: correct mouse position:
        let rect = this.canvas.getBoundingClientRect();

        this.mouse.set(event.clientX - rect.left, event.clientY - rect.top)
    }

    clear() {
        if (this.context !== null) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    setSize(w: number, h: number) {
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";

        this.canvas.width = w * window.devicePixelRatio;
        this.canvas.height = h * window.devicePixelRatio;
    }

    renderChildren(children: InterElement) {
        if (this.context !== null) {
            this.calls += 1;

            children.render(this.context, this.mouse);

            children.children.forEach((child: InterElement) => this.renderChildren(child))
        }

    }

    render(scene: Scene) {
        this.calls = 1;
        this.clear();

        this.renderChildren(scene);
    }

}