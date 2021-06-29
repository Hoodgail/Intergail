export declare var InterStylesheetDisplay: "block" | "flex";

export interface InterStylesheetInterface {
    stroke?: boolean;
    strokeColor?: string | CanvasGradient | CanvasPattern;
    margin?: number;
    radius?: number;
    strokeSize?: number;

    marginRight: number;
    marginTop: number;
    marginLeft: number;
    marginBottom: number;
}

export default class InterStylesheet {

    public stroke: boolean = false;
    public strokeSize: number = 2;
    public strokeColor: string | CanvasGradient | CanvasPattern = "black";
    public radius: number = 0;

    public marginRight: number = 0;
    public marginTop: number = 0;
    public marginLeft: number = 0;
    public marginBottom: number = 0;

    private _margin: number = 0;

    public get margin(): number { return this._margin; }

    public set margin(data) {
        this.marginRight = data;
        this.marginTop = data;
        this.marginLeft = data;
        this.marginBottom = data;

        this._margin = data;
    }

    display: typeof InterStylesheetDisplay = "flex";

}