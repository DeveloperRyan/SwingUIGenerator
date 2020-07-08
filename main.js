const { app, BrowserWindow } = require("electron");
const ipc = require("electron").ipcMain;
const fs = require("fs");
const { spawn } = require("child_process");

let win;

// Create the Electron app window
function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 1000,
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

// Write all of the label data, call screenshots.py, and reload the page
async function takeScreenshot(numPhotos) {
    let stream = fs.createWriteStream("labels.manifest", { flags: "a" });

    for (let i = 0; i < numPhotos; i++) {
        await new Promise((resolve, reject) => {
            ipc.once("sendLabels", async (event, data, err) => {
                if (err) reject(err);

                writeManifest(i, stream, data);
                spawn("python", ["screenshot.py", i.toString()]);
                await wait(300);

                resolve();
            });
        });
        await win.reload();
    }
}

function writeManifest(imageNumber, writeStream, bounds) {
    // Object fields have to be declared as such due to having hyphens in the names.
    try {
        let manifest = {};
        manifest["source-ref"] = `s3://bucket/labeled/${imageNumber}.png`;
        (manifest["bounding-box"] = {
            image_size: [
                {
                    // Size of the original image
                    width: 1000,
                    height: 1000,
                    depth: 3, // Depth represents the color depth, 3 = RGB.
                },
            ],
            annotations: [],
        }),
            (manifest["bounding-box-metadata"] = {
                type: "groundtruth/object-detection",
                objects: [],
            });
        manifest["bounding-box-metadata"]["class-map"] = {
            0: "button",
            1: "textbox",
        };
        manifest["bounding-box-metadata"]["human-annotated"] = "yes";
        manifest["bounding-box-metadata"]["creation-date"] = GetFormattedDateTime();
        manifest["bounding-box-metadata"]["job-name"] = "ATAK";

        for (let i = 0; i < bounds.length; i++) {
            manifest["bounding-box-metadata"]["objects"].push({ confidence: 1 });
        }

        for (let bound of bounds) {
            manifest["bounding-box"]["annotations"].push(bound);
        }

        writeStream.write(JSON.stringify(manifest) + "\r\n");
    } catch (err) {
        console.log(err);
    }
}

app.whenReady().then(function () {
    createWindow();
    takeScreenshot(1);
});

async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function GetFormattedDateTime() {
    let now = new Date();
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let day = ("0" + now.getDate()).slice(-2);
    let year = now.getFullYear();
    let hour = ("0" + (now.getHours() + 1)).slice(-2);
    let minute = ("0" + now.getMinutes()).slice(-2);
    let second = ("0" + now.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
