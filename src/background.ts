"use strict";

import { app, protocol, BrowserWindow, screen } from "electron";
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib";
import SettingsStore from "./background/settingsStore";
import Settings from "./shared/settings";
import { ipcMain } from "electron";

const isDevelopment: boolean = process.env.NODE_ENV !== "production";

// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows: BrowserWindow[] = [];
let settingsStore: SettingsStore = new SettingsStore();

settingsStore.onSettingsChanged(() => {
  initApplication();
});

// standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });

function initApplication(): Promise<void> {
  return settingsStore.loadSettings().then((settings: Settings) => {
    if (settings.sites.length === 0) {
      // no settings loaded -> create one window and navigate to settings view
      closeAllWindows();
      showSettings();
    } else {
      // settings loaded -> create necessary windows
      showSites(settings);
    }
  });
}

function closeAllWindows(): void {
  if (windows.length > 0) {
    for (let window of windows) {
      window.close();
    }
    windows.length = 0;
  }
}

function showSettings(): void {
  // create one window and navigate to the settings view
  let win: BrowserWindow = createWindow();
  navigateInWindow(win, "/settings");
}

function showSites(settings: Settings): void {
  // create a window per monitor setting

  let openWindows: Array<{ displayId: number, window: BrowserWindow, inUse: boolean }> | null = getOpenWindows();

  let allDisplays: Electron.Display[] = screen.getAllDisplays();
  let validDisplayIds: Array<number> = allDisplays.map(d => d.id);

  let usedDisplayIds: Array<number> = [];
  for (let site of settings.sites) {
    if (usedDisplayIds.indexOf(site.displayId) < 0) {
      if (validDisplayIds.indexOf(site.displayId) > -1) {
        usedDisplayIds.push(site.displayId);
      }
    }
  }

  if (usedDisplayIds.length === 0) {
    closeAllWindows();
    showSettings();
    return;
  }

  for (let usedDisplayId of usedDisplayIds) {
    let openWindow: { displayId: number, window: BrowserWindow, inUse: boolean } | undefined =
      openWindows.find(ow => ow.displayId === usedDisplayId);

    if (openWindow) {
      openWindow.inUse = true;
      navigateInWindow(openWindow.window, "/");
    } else {
      createWindow(usedDisplayId);
    }
  }

  let unusedWindows: Array<{ displayId: number, window: BrowserWindow, inUse: boolean }> = openWindows.filter(ow => !ow.inUse);

  for (let uw of unusedWindows) {
    let idx: number = windows.indexOf(uw.window);
    uw.window.close();
    if (idx > -1) {
      windows.splice(idx, 1);
    }
  }
}

function getOpenWindows(): Array<{ displayId: number, window: BrowserWindow, inUse: boolean }> {
  if (windows.length === 0) {
    return [];
  }

  let result: Array<{ displayId: number, window: BrowserWindow, inUse: boolean }> = [];

  for (let window of windows) {
    let windowBounds: Electron.Rectangle = window.getBounds();
    let display: Electron.Display = screen.getDisplayMatching(windowBounds);
    let r: { displayId: number, window: BrowserWindow, inUse: boolean } = {
      displayId: display.id,
      window: window,
      inUse: false
    };
    result.push(r);
  }

  return result;
}

function createWindow(displayId?: number): BrowserWindow {
  // create the browser window.
  let browserWindowConstructorOptions: Electron.BrowserWindowConstructorOptions = { width: 800, height: 600, show: false };

  if (displayId && displayId >= 0) {
    var display: Electron.Display | undefined = screen.getAllDisplays().find(d => d.id === displayId);
    if (display) {
      browserWindowConstructorOptions.x = display.bounds.x;
      browserWindowConstructorOptions.y = display.bounds.y;
      if (browserWindowConstructorOptions.width! > display.bounds.width) {
        browserWindowConstructorOptions.width = display.bounds.width;
      }
      if (browserWindowConstructorOptions.height! > display.bounds.height) {
        browserWindowConstructorOptions.height = display.bounds.height;
      }
    } else {
      console.error("internal error: display with id '" + displayId + "' not found.");
    }
  }

  let win: BrowserWindow = new BrowserWindow(browserWindowConstructorOptions);

  let didFinishLoadResolve: any;
  let promise: Promise<any> = new Promise<any>((resolve, reject) => {
    didFinishLoadResolve = resolve;
  });
  (<any>win.webContents).WALLBOARD_EXT_DidFinishLoad = promise;
  win.webContents.on("did-finish-load", () => {
    didFinishLoadResolve();
  });

  windows.push(win);

  win.setMenuBarVisibility(false);

  if (isDevelopment || process.env.IS_TEST) {
    // load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol("app");
    // load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.once("ready-to-show", () => {
    win.maximize();
  });

  win.on("closed", () => {
    let idx: number = windows.indexOf(win);
    if (idx >= 0) {
      windows.splice(idx, 1);
    }
  });

  return win;
}

function navigateInWindow(window: BrowserWindow, url: string): void {
  (<any>window.webContents).WALLBOARD_EXT_DidFinishLoad.then(() => {
    window.webContents.send("navigationRequest", url);
  });
}

// quit when all windows are closed.
app.on("window-all-closed", () => {
  // on macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  initApplication();
});

// this method will be called when Electron has finished
// initialization and is ready to create browser windows.
// some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // install Vue Devtools
    await installVueDevtools();
  }
  await initApplication();
});

// exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
