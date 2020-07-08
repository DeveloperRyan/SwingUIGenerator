const ipc = require("electron").ipcRenderer;

const MAIN_CONTAINER = document.getElementById("main-container");
let labels = []; // Label data for Rekognition

function createElements() {
    let numElements = Math.floor(Math.random() * 5) + 1;
    let groupDiv = document.createElement("div");
    groupDiv.className = "mini-container";

    for (let i = 0; i < numElements; i++) {
        let element = chooseElement();
        groupDiv.appendChild(element);
    }

    MAIN_CONTAINER.appendChild(groupDiv);

    getElementBounds(groupDiv);
}

function chooseElement() {
    let randNum = Math.floor(Math.random() * 5) + 1;

    let id, label, container;
    switch (randNum) {
        case 1:
            let paragraph = document.createElement("p");
            paragraph.innerHTML = createString(Math.floor(Math.random() * 15) + 1);

            return paragraph;
        case 2:
            let textbox = document.createElement("input");
            textbox.type = "text";
            textbox.style.width = `${Math.floor(Math.random() * 150 + 50)}px`;
            return textbox;
        case 3:
            let button = document.createElement("button");
            button.innerHTML = createString(Math.floor(Math.random() * 10) + 1);
            changeHue(button);
            return button;
        case 4:
            container = document.createElement("div");
            container.className = "radio-container";

            let radio = document.createElement("input");
            id = createString(Math.floor(Math.random() * 7) + 1); // Create an id for the label

            radio.id = id;
            radio.type = "radio";
            radio.checked = Math.random() > 0.5;

            label = document.createElement("label");
            label.innerHTML = id;
            label.setAttribute("for", id);

            container.appendChild(radio);
            container.appendChild(label);

            return container;
        case 5:
            container = document.createElement("div");
            container.className = "checkbox-container";

            let checkbox = document.createElement("input");
            id = createString(Math.floor(Math.random() * 7) + 1); // Create an id for the label

            checkbox.id = id;
            checkbox.type = "checkbox";
            checkbox.checked = Math.random() > 0.5;

            label = document.createElement("label");
            label.innerHTML = id;
            label.setAttribute("for", id);

            container.appendChild(checkbox);
            container.appendChild(label);

            return container;
    }
}

function createInterface(numSections) {
    for (let i = 0; i < numSections; i++) {
        createElements();
    }
}

function createString(length) {
    let str = "";
    for (let i = 0; i < length; i++) {
        str += Math.random().toString(36).substring(2, 3);
    }

    return str;
}

function changeHue(element) {
    let hue = Math.floor(Math.random() * 361);
    element.style.background = `linear-gradient(
        0deg,
        hsl(${hue}, 44%, 83%) 0%,
        hsl(0, 0%, 100%) 75%,
        hsl(${hue}, 44%, 83%) 100%
    )`;
}

function getElementBounds(group) {
    for (let child of group.children) {
        let tagName = child.tagName.toLowerCase();
        console.log(tagName);
        // Don't include the bounds of paragraphs or labels
        if (tagName === "p" || tagName === "label") continue;

        // If the element is a div, select the input element
        if (tagName === "div") child = child.children[0];

        let bounds = child.getBoundingClientRect();
        let data = {
            class_id: getClassId(child),
            top: Math.round(bounds.top),
            left: Math.round(bounds.left),
        };
        data.height = Math.round(Math.abs(data.top - bounds.bottom));
        data.width = Math.round(Math.abs(data.left - bounds.right));

        labels.push(data);
    }
}

function getClassId(element) {
    const CLASS_IDS = {
        button: 0,
        text: 1,
        radio: 2,
        checkbox: 3,
    };

    let tagName = element.tagName.toLowerCase();
    // If the element is an input, we need to check the type
    if (tagName === "input") {
        let type = element.type;
        console.log(type);
        return CLASS_IDS[type];
    } else return CLASS_IDS[tagName];
}

function sendLabels() {
    ipc.send("sendLabels", labels);
}

createInterface(10);
sendLabels();
