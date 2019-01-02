import Settings from "../shared/settings";
import { ipcRenderer, Event } from "electron";
import Serialijse from "serialijse";

export default class SettingsStore {

    public loadSettings(): Promise<Settings> {
        return new Promise((resolve, reject) => {
            let channelName: string = "loadedSettingsResult_" + Math.random().toString() + window.performance.now().toString();

            ipcRenderer.once(channelName, (e: Event, settingsStr: string) => {
                let settings: Settings = Serialijse.deserialize<Settings>(settingsStr);
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

            let settingsStr: string = Serialijse.serialize(settings);

            ipcRenderer.send("settingsStore_saveSettings", channelName, settingsStr);
        });
    }

    public clearCache(): void {
        ipcRenderer.send("settingsStore_clearCache");
    }

}