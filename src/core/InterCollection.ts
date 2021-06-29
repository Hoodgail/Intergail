import InterElement from "./InterElement";

export default class InterCollection extends Array<InterElement> {

    public item(index: number): InterElement | null {
        return this[index] || null
    }

}