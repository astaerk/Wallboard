import Settings from "../shared/settings";
import * as fs from "fs";
import { app, ipcMain, Event } from "electron";
import MonitorManager from "./monitorManager";
import Serialijse from "serialijse";

export default class SettingsStore {

    private settingsFilePath: string = app.getPath("appData") + "/Wallboard/settings.json";

    private _monitorManager = new MonitorManager();

    private settings: Promise<Settings> | null = null;

    private onSettingsChangedCallback: (() => void) | null = null;

    public get monitorManager(): MonitorManager {
        return this._monitorManager;
    }

    constructor() {
        this.registerIPCEvents();
    }

    public loadSettings(): Promise<Settings> {
        if (this.settings == null) {
            this.settings = this.loadSettingsFromFile();
        }
        return this.settings.then((value: Settings): Settings => {
            value.monitors = value.monitors || [];
            this._monitorManager.complementWithCurrentMonitors(value.monitors);
            return value;
        });
    }

    public saveSettings(settings: Settings): Promise<void> {
        return this.saveSettingsToFile(settings).then(() => {
            this.clearCache();
            if (this.onSettingsChangedCallback) {
                this.onSettingsChangedCallback();
            }
        });
    }

    public clearCache(): void {
        this.settings = null;
    }

    public onSettingsChanged(callback: () => void): void {
        this.onSettingsChangedCallback = callback;
    }

    private registerIPCEvents(): void {
        ipcMain.on("settingsStore_loadSettings", (e: Event, responseChannelName: string) => this.onLoadSettings(e, responseChannelName));
        ipcMain.on("settingsStore_saveSettings", (e: Event, responseChannelName: string, settings: Settings) => {
            this.onSaveSettings(e, responseChannelName, settings);
        });
        ipcMain.on("settingsStore_clearCache", (e: Event) => this.onClearSettingsCache(e));
    }

    private onLoadSettings(e: Event, responseChannelName: string): void {
        this.loadSettings().then((settings: Settings) => {
            e.sender.send(responseChannelName, settings);
        });
    }

    private onSaveSettings(e: Event, responseChannelName: string, settings: Settings): void {
        this.saveSettings(settings).then(() => {
            e.sender.send(responseChannelName);
        });
    }

    private onClearSettingsCache(e: Event): void {
        this.clearCache();
    }

    private loadSettingsFromFile(): Promise<Settings> {
        return new Promise<Settings>((resolve, reject) => {

            if (!fs.existsSync(this.settingsFilePath)) {
                resolve(new Settings());
            }

            fs.readFile(this.settingsFilePath, (err: NodeJS.ErrnoException, data: Buffer) => {
                if (err) {
                    reject(err);
                    return;
                }

                let settingsString: string = data.toString();

                let settings: Settings = Serialijse.deserialize<Settings>(settingsString);

                resolve(settings);
            });
        });
    }

    private saveSettingsToFile(settings: Settings): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.settingsFilePath, Serialijse.serialize(settings), (err: NodeJS.ErrnoException) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}
