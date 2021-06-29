import InterElement, { computedStyleDataInterface } from "../InterElement";

export default class InterImageElement extends InterElement {
    private _src: string = "";

    public image = new Image(this.size.x, this.size.y);
    public loading: boolean = false;
    public loaded: boolean = false;

    public get src(): string {
        return this._src
    }
    public set src(url) {
        this._src = url;

        this.reload();
    }

    reload() {
        this.loading = true;
        this.loaded = false;

        const load = () => {

            this.loaded = true;
            this.loading = false;
            this.image.removeEventListener("load", load)
        }

        this.image.addEventListener("load", load)

        this.image.src = this.src;
    }

    draw(context: CanvasRenderingContext2D, style: computedStyleDataInterface) {
        context.drawImage(
            this.image,
            style.position.x,
            style.position.y,
            this.size.x,
            this.size.y
        );
    }

}