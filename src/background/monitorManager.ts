import { ipcMain, Event, screen, BrowserWindow } from "electron";
import Monitor from "../shared/monitor";
import Serialijse from "serialijse";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

const isDevelopment: boolean = process.env.NODE_ENV !== "production";

export default class MonitorManager {

    constructor() {
        this.registerIPCEvents();
    }

    public getCurrentMonitorIds(): Array<number> {
        let allDisplays: Electron.Display[] = screen.getAllDisplays();
        return allDisplays.map(d => d.id);
    }

    public complementWithCurrentMonitors(monitors: Monitor[]): void {

        let allDisplays: Electron.Display[] = screen.getAllDisplays().sort((a: Electron.Display, b: Electron.Display): number => {
            if (a.bounds.y + a.bounds.height < b.bounds.y) {
                return -1;
            }
            if (a.bounds.y > b.bounds.y + b.bounds.height) {
                return 1;
            }
            if (a.bounds.x < b.bounds.x) {
                return -1;
            }
            return 1;
        });

        for (let display of allDisplays) {
            let existingMonitor: Monitor | undefined = monitors.find(m => m.id === display.id);
            if (existingMonitor) {
                // here we could update the existing monitor if necessary
            } else {
                let monitorNo: number = monitors.length + 1;
                var displayName: string = "Monitor " + monitorNo.toString()
                    + " (" + display.bounds.width.toString() + "x" + display.bounds.height.toString() + ")";
                existingMonitor = new Monitor(display.id, displayName);
                monitors.push(existingMonitor);
            }
        }
    }

    public showMonitorIdentificationWindows(availableMonitors: Monitor[]): void {
        if (!availableMonitors) {
            availableMonitors = [];
        }

        this.complementWithCurrentMonitors(availableMonitors);

        let currentMonitorIds: number[] = this.getCurrentMonitorIds();

        let windows: BrowserWindow[] = [];
        for (let monitorId of currentMonitorIds) {
            let monitor: Monitor | undefined = availableMonitors.find(m => m.id === monitorId);
            if (monitor) {
                let window: BrowserWindow = new BrowserWindow({
                    width: 600,
                    height: 600,
                    transparent: true,
                    frame: false,
                    show: false
                });

                let url: string = "/windowIdentification.html?name=" + monitor.displayName;

                if (isDevelopment || process.env.IS_TEST) {
                    // load the url of the dev server if in development mode
                    window.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + url);
                } else {
                    createProtocol("app");
                    // load the windowIdentification.html when not in development
                    window.loadURL("app://." + url);
                }

                // window.webContents.openDevTools();

                windows.push(window);
            } else {
                console.error("Internal error: monitor with id '" + monitorId + "' not found.");
            }
        }

        for (let window of windows) {
            window.show();
        }

        /*setTimeout(() => {
            for (let window of windows) {
                window.close();
            }
        }, 5000);*/
    }

    private registerIPCEvents(): void {
        ipcMain.on("showMonitorIdentificationWindows", (e: Event, monitorsStr: string) => {
            var monitors: Monitor[] = Serialijse.deserialize<Monitor[]>(monitorsStr);
            this.showMonitorIdentificationWindows(monitors);
        });
    }
}
