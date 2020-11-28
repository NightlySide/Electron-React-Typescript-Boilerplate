// BLOG QUI M'A SAUVE https://www.keevan.dev/blog/2020/02/setting-up-electron-react-and-typescript
// tres bon starter : https://github.com/sketchbuch/electron-parcel-react-typescript

import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
import isDev from "electron-is-dev";

import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true, // this line is very important as it allows us to use `require` syntax in our html file.
			webSecurity: false
		}
	});

	// and load the index.html of the app.
	if (isDev) {
		mainWindow.loadURL("http://localhost:3000");
	} else {
		mainWindow.loadURL(
			url.format({
				pathname: path.join(__dirname, "../index.html"),
				protocol: "file:",
				slashes: true
			})
		);
	}

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
