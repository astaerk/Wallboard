"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib";

const isDevelopment: boolean = process.env.NODE_ENV !== "production";

// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows: BrowserWindow[] = [];

// standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });

function initApplication(): void {
  if (windows.length > 0) {
    return;
  }

  createWindow();
}

function createWindow(): void {
  // create the browser window.
  let win: BrowserWindow = new BrowserWindow({ width: 800, height: 600, show: false });

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

  win.maximize();

  win.on("closed", () => {
    let idx: number = windows.indexOf(win);
    if (idx >= 0) {
      windows.splice(idx, 1);
    }
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
  initApplication();
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
