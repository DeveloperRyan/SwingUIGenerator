const { app, BrowserWindow } = require("electron");
const ipc = require("electron").ipcMain;
const fs = require("fs");
const { spawn } = require("child_process");

let win;

// Create the Electron app window
function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 700,
        autoHideMenuBar: true,
        fullscreen: true,
        x: 0,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
        },
    });
}

// Write all of the label data, call screenshots.py, and reload the page
async function takeScreenshot(numPhotos) {
    let stream = fs.createWriteStream("labels.manifest", { flags: "a" });

    for (let i = 0; i < numPhotos; i++) {
        await new Promise((resolve, reject) => {
            win.loadFile("index.html");

            // Wait for the front-end script to send the labels
            ipc.once("sendLabels", async (event, data, err) => {
                if (err) reject(err);

                writeManifest(i, stream, data); // Write the manifest file with the given labels
                spawn("python", ["screenshot.py", i.toString()]); // Call the python screenshot script
                await wait(350);
                resolve(); // Resolve the promise
            });
        });
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
                    width: 700,
                    height: 700,
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
            2: "radio",
            3: "checkbox",
        };
        manifest["bounding-box-metadata"]["human-annotated"] = "yes";
        manifest["bounding-box-metadata"][
            "creation-date"
        ] = GetFormattedDateTime();
        manifest["bounding-box-metadata"]["job-name"] = "ATAK";

        for (let i = 0; i < bounds.length; i++) {
            manifest["bounding-box-metadata"]["objects"].push({
                confidence: 1,
            });
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

function wait(ms) {
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
