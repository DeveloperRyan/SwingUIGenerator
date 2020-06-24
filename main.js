let { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 735,
		height: 750,
		autoHideMenuBar: true,
		fullscreen: true,
		x: 0,
		y: 0,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	win.loadFile("index.html");
}

async function takeScreenshot(numPhotos) {
	for (let i = 0; i < numPhotos; i++) {
		await new Promise((resolve) =>
			setTimeout(() => {
				spawn("python", ["screenshot.py", i.toString()]);
				win.reload();
				resolve();
			}, 150)
		);
	}
}

app.whenReady().then(function () {
	createWindow();
	// takeScreenshot(1000);
});
