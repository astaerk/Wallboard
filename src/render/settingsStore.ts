import Settings from "../shared/settings";
import { ipcRenderer, Event } from "electron";

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

    public saveSettings(settings: Settings): Promise<void> {
        return new Promise((resolve, reject) => {
            let channelName: string = "saveSettingsResult_" + Math.random().toString() + window.performance.now().toString();

            ipcRenderer.once(channelName, (e: Event) => {
                resolve();
            });

            ipcRenderer.send("settingsStore_saveSettings", channelName, settings);
        });
    }

    public clearCache(): void {
        ipcRenderer.send("settingsStore_clearCache");
    }

}