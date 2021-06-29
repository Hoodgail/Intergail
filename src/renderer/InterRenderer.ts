import InterElement from "../core/InterElement";
import Scene from "../core/Scene";

export default class InterRenderer {

    public calls: number = 0;

    private _context: CanvasRenderingContext2D | null = null;

    public canvas: HTMLCanvasElement = document.createElement("canvas");

    public get context(): CanvasRenderingContext2D | null {
        if (this._context !== null) return this._context;

        this._context = this.canvas.getContext("2d")
        return this._context;
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

    renderChildren(children: InterElement, parent: InterElement) {
        children.localPosition.copy(children.position.clone().add(parent.localPosition));

        if (this.context !== null) {
            this.calls += 1;

            children.render(this.context);

            children.children.forEach((child: InterElement) => this.renderChildren(child, children))
        }

    }

    render(scene: Scene) {
        this.calls = 0;
        this.clear();
        scene.children.forEach((child: InterElement) => this.renderChildren(child, scene))
    }

}