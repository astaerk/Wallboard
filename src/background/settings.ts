import Site from "./site";

export default class Settings {

    public sites: Site[] = [];

    constructor() {
        this.sites.push(new Site(1, "www.google.de", 2528732444));
        this.sites.push(new Site(2, "www.amazon.de", 2528732444));
        this.sites.push(new Site(3, "www.microsoft.com", 2779098405));
    }

}