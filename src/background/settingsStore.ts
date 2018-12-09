import Settings from "../shared/settings";
import * as fs from "fs";
import { app, ipcMain, Event } from "electron";

export default class SettingsStore {

    // private settingsFilePath: string = app.getPath("appData") + "/Wallboard/settings.json";

    // private settings: Promise<Settings> | null = null;

    constructor() {
        this.registerIPCEvents();
    }

    public loadSettings(): Promise<Settings> {
        return new Promise<Settings>((resolve, reject) => {
            resolve(new Settings());
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

    private registerIPCEvents(): void {
        ipcMain.on("settingsStore_loadSettings", (e: Event, responseChannelName: string) => this.onLoadSettings(e, responseChannelName));
    }

    private onLoadSettings(e: Event, responseChannelName: string): void {
        this.loadSettings().then((settings: Settings) => {
            e.sender.send(responseChannelName, settings);
        });
    }

}