import Settings from "../shared/settings";
import { ipcRenderer } from "electron";

export default class SettingsStore {

    public loadSettings(): Promise<Settings> {
        return new Promise((resolve, reject) => {
            let channelName: string = "loadedSettingsResult_" + Math.random().toString() + window.performance.now().toString();

            ipcRenderer.once(channelName, (e: Event, settings: Settings) => {
                resolve(settings);
            });

            ipcRenderer.send("settingsStore_loadSettings", channelName);
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