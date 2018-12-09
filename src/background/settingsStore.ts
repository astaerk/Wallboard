import Settings from "./settings";
import * as fs from "fs";
import { app } from "electron";

export default class SettingsStore {

    // private settingsFilePath: string = app.getPath("appData") + "/Wallboard/settings.json";

    // private settings: Promise<Settings> | null = null;

    public loadSettings(): Settings {
        return new Settings();
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