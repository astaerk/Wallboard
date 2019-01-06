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
                let displayName: string = "Monitor " + existingMonitor.monitorNumber.toString()
                    + " (" + display.bounds.width.toString() + "x" + display.bounds.height.toString() + ")";
                existingMonitor.displayName = displayName;
            } else {
                let monitorNo: number = monitors.length + 1;
                let displayName: string = "Monitor " + monitorNo.toString()
                    + " (" + display.bounds.width.toString() + "x" + display.bounds.height.toString() + ")";
                existingMonitor = new Monitor(display.id, monitorNo, displayName);
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

        let allCurrentDisplays: Electron.Display[] = screen.getAllDisplays();

        const desiredWidth: number = 650;
        const desiredHeight: number = 250;

        let windows: BrowserWindow[] = [];
        for (let monitorId of currentMonitorIds) {
            let monitor: Monitor | undefined = availableMonitors.find(m => m.id === monitorId);
            if (monitor) {

                var display: Electron.Display | undefined = allCurrentDisplays.find(d => d.id === monitorId);

                if (display) {
                    let browserWindowConstructorOptions: Electron.BrowserWindowConstructorOptions = {
                        width: (display.bounds.width > desiredWidth ? desiredWidth : display.bounds.width),
                        height: (display.bounds.height > desiredHeight ? desiredHeight : display.bounds.height),
                        transparent: true,
                        frame: false,
                        show: false,
                        alwaysOnTop: true,
                        center: true,
                        focusable: false,
                        movable: false,
                        resizable: false,
                        skipTaskbar: true
                    };

                    let x: number = display.bounds.x + ((display.bounds.width - browserWindowConstructorOptions.width!) / 2);
                    let y: number = display.bounds.y + ((display.bounds.height - browserWindowConstructorOptions.height!) / 2);
                    browserWindowConstructorOptions.x = x;
                    browserWindowConstructorOptions.y = y;

                    let window: BrowserWindow = new BrowserWindow(browserWindowConstructorOptions);

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
                    console.error("Internal error: electron display with id '" + monitorId + "' not found.");
                }
            } else {
                console.error("Internal error: monitor with id '" + monitorId + "' not found.");
            }
        }

        for (let window of windows) {
            window.show();
        }

        setTimeout(() => {
            for (let window of windows) {
                window.close();
            }
        }, 5000);
    }

    private registerIPCEvents(): void {
        ipcMain.on("showMonitorIdentificationWindows", (e: Event, monitorsStr: string) => {
            var monitors: Monitor[] = Serialijse.deserialize<Monitor[]>(monitorsStr);
            this.showMonitorIdentificationWindows(monitors);
        });
    }
}
