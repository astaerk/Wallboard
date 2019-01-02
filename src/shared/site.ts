export default class Site {
    public id: number;
    public name: string;
    public displayId: number;

    constructor(id: number, name: string, displayId: number) {
        this.id = id;
        this.name = name;
        this.displayId = displayId;
    }
}