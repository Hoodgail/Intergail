import Vector2 from "../math/Vector2";
import InterStylesheet, { InterStylesheetInterface } from "./InterStylesheet";
import InterCollection from "./InterCollection";

export declare var InterElementIntersectionType: "square" | "radius";

export interface computedStyleDataInterface {
    position: Vector2;
    size: Vector2
}

/** Represents all elements */
export default class InterElement {

    public parent: InterElement | null = null;

    /** element's position within its parent or screen */
    public readonly position: Vector2 = new Vector2(0, 0);
    public readonly localPosition: Vector2 = new Vector2();

    /** element's width and height */
    public readonly size: Vector2 = new Vector2(0, 0);

    public readonly stylesheet: InterStylesheet = new InterStylesheet();

    public children: InterCollection = new InterCollection();

    public hover: boolean = false;
    public clicked: boolean = false;

    get style() {
        return this.stylesheet
    }

    set style(data: string | InterStylesheetInterface) {
        if (typeof data == "string") Object.assign(this.stylesheet, JSON.parse(data));
        else Object.assign(this.stylesheet, data);
    }

    get nextChild(): InterElement | null {
        if (this.parent !== null) {
            return this.parent.children.item(this.parent.children.indexOf(this) + 1);
        } else {
            return null
        }
    }

    get previousChild(): InterElement | null {
        if (this.parent !== null) {
            let index = this.parent.children.indexOf(this) - 1;

            return index < 0 ? null : this.parent.children.item(index);
        } else {
            return null
        }
    }

    append(...child: Array<InterElement>) {
        child.forEach(children => {
            children.parent = this;
            this.children.push(children);
        })
    }

    intersects(element: InterElement, type: typeof InterElementIntersectionType = "square"): boolean {

        const data = this.computedStyleData();
        const elementData = element.computedStyleData()

        switch (type) {
            case "square":
            default:
                return elementData.position.x < data.position.x + this.size.x &&
                    elementData.position.x + element.size.x > data.position.x &&
                    elementData.position.y < data.position.y + this.size.y &&
                    elementData.position.y + element.size.y > data.position.y;

            // will be worked on once radius style is added.
            case "radius":
                return false
        }
    }



    public begin(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();

        if (this.parent !== null) this.localPosition.copy(this.position.clone().add(this.parent.localPosition))
        else this.localPosition.copy(this.position);
    }

    public end(context: CanvasRenderingContext2D) {
        context.restore();
    }

    computedStyleData(): computedStyleDataInterface {
        const pc: InterElement | null = this.previousChild;

        const position: Vector2 = this.localPosition.clone();
        const size: Vector2 = this.size.clone();

        position.x -= this.stylesheet.marginLeft == this.stylesheet.marginRight
            ? 0 : this.stylesheet.marginRight;
        position.x += this.stylesheet.marginLeft
        position.y += this.stylesheet.marginTop
        position.y -= this.stylesheet.marginTop == this.stylesheet.marginBottom
            ? 0 : this.stylesheet.marginBottom;

        if (this.stylesheet.stroke == true) {
            position.x += this.stylesheet.strokeSize;
            position.y += this.stylesheet.strokeSize;
        }


        switch (this.stylesheet.display) {
            case "flex":
            default:
                if (this.children.length !== 0) {
                    this.children.forEach(child => {

                        const data = child.computedStyleData();

                        size.x += child.stylesheet.marginRight;
                        size.x += child.stylesheet.marginLeft

                        size.add(data.size);

                    });

                    let child = this.children.reduce(function (prev, current) {
                        return (prev.size.y > current.size.y) ? prev : current
                    });

                    let ch = child.computedStyleData();

                    size.y = ch.size.y;
                    size.y += child.stylesheet.marginBottom;
                    size.y += child.stylesheet.marginTop;
                }
                break;

        }

        if (this.parent !== null && pc !== null) {

            switch (this.parent.stylesheet.display) {

                case "flex":
                default:
                    position.x += pc.size.x;
                    position.x += pc.stylesheet.marginRight;
                    position.x += pc.stylesheet.marginLeft;

                    break;

                case "block":
                    position.y -= pc.size.y;
                    position.y -= pc.stylesheet.marginTop;
                    position.y -= pc.stylesheet.marginBottom;
                    break;
            }
        }

        return { position, size }
    }

    renderRound(context: CanvasRenderingContext2D, { position, size }: computedStyleDataInterface) {
        const { x, y } = position;
        const { radius } = this.stylesheet;
        const width = size.x;
        const height = size.y;

        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);

        context.clip();
    }

    renderStroke(context: CanvasRenderingContext2D) {
        let line = context.lineWidth;

        context.lineWidth = this.stylesheet.strokeSize;
        context.stroke();
        context.lineWidth = line;
    }

    public render(context: CanvasRenderingContext2D, mouse: Vector2) {

        this.begin(context);

        const style = this.computedStyleData();
        const { position, size } = style;

        if (this.stylesheet.radius !== 0) this.renderRound(context, style)

        context.rect(
            position ? position.x : this.localPosition.x,
            position ? position.y : this.localPosition.y,
            size.x,
            size.y
        );

        this.draw(context, style);

        context.strokeStyle = this.stylesheet.strokeColor;

        if (this.stylesheet.stroke == true) this.renderStroke(context);

        this.hover = context.isPointInPath(mouse.x, mouse.y)

        this.end(context);

    }

    draw(context: CanvasRenderingContext2D, style: computedStyleDataInterface) { }
}