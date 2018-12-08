import Settings from "./settings";

export default class SettingsStore {
    constructor() {
        //
    }

    public loadSettings(): Settings {
        return new Settings();
    }

    public saveSettings(): void {
        //
    }

    public clearCache(): void {
        //
    }
}