export default class Monitor {

    private _id: number;
    private _displayName: string;
    private _monitorNumber: number;

    public get id(): number {
        return this._id;
    }

    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }

    public get monitorNumber(): number {
        return this._monitorNumber;
    }
    public set monitorNumber(value: number) {
        this._monitorNumber = value;
    }

    constructor(id: number, monitorNumber: number, displayName: string) {
        this._id = id;
        this._monitorNumber = monitorNumber;
        this._displayName = displayName;
    }

}