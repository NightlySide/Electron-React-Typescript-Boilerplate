// BLOG QUI M'A SAUVE https://www.keevan.dev/blog/2020/02/setting-up-electron-react-and-typescript

import { app, BrowserWindow } from "electron";
import path from "path";
import http from "http";
import { Server } from "node-static";

import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

import electronReload from "electron-reload";
electronReload(path.join(__dirname, "../"), {
  electron: path.join(__dirname, "../", "node_modules", ".bin", "electron"),
  hardResetMethod: "exit",
});

const file = new Server(`${path.resolve(__dirname, "../")}`);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // this line is very important as it allows us to use `require` syntax in our html file.
      webSecurity: false,
    },
  });

  http
    .createServer(function (request, response) {
      request
        .addListener("end", function () {
          file.serve(request, response);
        })
        .resume();
    })
    .listen(8080);

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.loadURL("http://localhost:8080/public/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Installing devtools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name: string) => console.log(`Added Extension:  ${name}`))
    .catch((err: string) => console.log("An error occurred: ", err));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
