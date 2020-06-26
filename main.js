const { app, BrowserWindow } = require("electron");
const ipc = require("electron").ipcMain;
const fs = require("fs");
const { spawn } = require("child_process");
const { electron } = require("process");

let win;

// Create the Electron app window
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

// Get the labels from the renderer
let labels = ipc.on("sendLabels", (labels) => {
	return labels;
});

// Write all of the label data, call screenshots.py, and reload the page 
async function takeScreenshot(numPhotos) {
	let stream = fs.createWriteStream("labels.manifest", {flags: 'a'});

	for (let i = 0; i < numPhotos; i++) {
		await new Promise((resolve) =>
			setTimeout(() => {
				writeManifest(i, stream);
				spawn("python", ["screenshot.py", i.toString()]);
				await win.reload();
				resolve();
			}, 150)
		);
	}
}

function writeManifest(imageNumber, writeStream) {
		// Object fields have to be declared as such due to having hyphens in the names.
		let imageData = {};
		imageData['source-ref'] = `s3://bucket/unlabeled/${i}.png`;
		imageData['bounding-box'] = {
			image_size: [{ // Size of the original image
				width: 750,
				height: 765,
				depth: 3 // Depth represents the color depth, 3 = RGB.
			}],
			annotations: [
				// Add these after?
			]
		};

		imageData['bounding-box-metadata'] = {}

	let labelData = {}
	writeStream.write()
}

app.whenReady().then(function () {
	createWindow();
	takeScreenshot(15);
});
