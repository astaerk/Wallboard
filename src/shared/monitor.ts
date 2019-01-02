import Serializable from "./serializableDecorator";

@Serializable()
export default class Monitor {

    private _id: number;
    private _displayName: string;

    public get id(): number {
        return this._id;
    }

    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }

    constructor(id: number, displayName: string = "") {
        this._id = id;
        this._displayName = displayName;
    }

}