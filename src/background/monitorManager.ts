import { ipcMain, Event, screen, BrowserWindow } from "electron";
import Monitor from "../shared/monitor";

export default class MonitorManager {

    constructor() {
        // this.registerIPCEvents();
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
            var existingMonitor: Monitor | undefined = monitors.find(m => m.id === display.id);
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







    /*public showMonitorIdentificationWindows(availableDisplays: Array<{ id: number; name: string }>): void {
        if (!availableDisplays) {
            availableDisplays = [];
            this.loadAvailableDisplays(availableDisplays);
        }

        let windows: BrowserWindow[] = [];
        for (let display of availableDisplays) {
            let window: BrowserWindow = new BrowserWindow({
                width: 600,
                height: 600,
                transparent: true,
                frame: false,
                show: false
            });
            windows.push(window);
        }

        for (let window of windows) {
            // display.id, display.name;
        }
    }

    private registerIPCEvents(): void {
        ipcMain.on("showMonitorIdentificationWindows", (e: Event, d: Array<{ id: number; name: string }>) => {
            this.showMonitorIdentificationWindows(d);
        });
    }

    private loadAvailableDisplays(
        availableDisplays: Array<{ id: number; name: string }>
    ): void {
        let allDisplays: Electron.Display[] = screen
            .getAllDisplays()
            .sort((a: Electron.Display, b: Electron.Display): number => {
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

        availableDisplays.length = 0;

        let i: number = 1;
        for (let display of allDisplays) {
            availableDisplays.push({
                id: display.id,
                name: "Monitor " + i.toString()
            });
            i++;
        }
    }*/
}
