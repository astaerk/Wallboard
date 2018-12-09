import Settings from "../shared/settings";
import Site from "../shared/site";

export default class SettingsStore {

    public loadSettings(): Promise<Settings> {
        return new Promise((resolve, reject) => {
            let s: Settings = new Settings();
            s.sites.push(new Site(1, "www.google.de", 2528732444));
            s.sites.push(new Site(2, "www.amazon.de", 2528732444));
            s.sites.push(new Site(3, "www.microsoft.com", 2779098405));
            resolve(s);
        });
    }

    /*public loadSettings(): Promise<Settings> {
        if (this.settings == null) {
            this.settings = this.loadSettingsFromFile();
        }
        return this.settings;
    }*/

    public saveSettings(/*a: number*/): void /*Promise<void>*/ {
        /*return new Promise((resolve, reject) => {
            fs.writeFile(this.settingsFilePath, this.settings, (err: NodeJS.ErrnoException) => {
                if (err) {
                    console.error(err);
                    reject();
                    return;
                }
            });
        });*/
    }

    public clearCache(): void {
        // this.settings = null;
    }

    /*private loadSettingsFromFile(): Promise<Settings> {
        return new Promise<Settings>((resolve, reject) => {
            if (fs.existsSync)
        });
    }*/
}