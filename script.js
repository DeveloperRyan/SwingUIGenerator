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
        case 1: // Paragraph
            let paragraph = document.createElement("p");
            paragraph.innerHTML = createString(
                Math.floor(Math.random() * 15) + 1
            );

            return paragraph;
        case 2: // Textbox
            let textbox = document.createElement("input");
            textbox.type = "text";
            textbox.style.width = `${Math.floor(Math.random() * 150 + 50)}px`;

            return textbox;
        case 3: // Button
            let button = document.createElement("button");
            button.innerHTML = createString(Math.floor(Math.random() * 10) + 1);
            changeBackgroundHue(button);

            return button;
        case 4: // Radio
            container = document.createElement("div");
            container.className = "radio-container";

            let radio = document.createElement("img");
            radio.height = "12";
            radio.width = "12";
            radio.class = "radio";

            Math.random() > 0.5
                ? (radio.src = "./assets/r-selected.png")
                : (radio.src = "./assets/r-unselected.png");

            changeImageHue(radio);

            text = document.createElement("p");
            text.innerHTML = createString(Math.floor(Math.random() * 7) + 1);

            container.appendChild(radio);
            container.appendChild(text);

            return container;
        case 5: // Checkbox
            container = document.createElement("div");
            container.className = "checkbox-container";

            let cb = document.createElement("img");
            cb.height = "13";
            cb.width = "13";
            cb.class = "checkbox";

            Math.random() > 0.5
                ? (cb.src = "./assets/cb-checked.png")
                : (cb.src = "./assets/cb-unchecked.png");

            changeImageHue(cb);

            text = document.createElement("p");
            text.innerHTML = createString(Math.floor(Math.random() * 7) + 1);

            container.appendChild(cb);
            container.appendChild(text);

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

function changeBackgroundHue(element) {
    let hue = Math.floor(Math.random() * 361);
    element.style.background = `linear-gradient(
        0deg,
        hsl(${hue}, 44%, 83%) 0%,
        hsl(0, 0%, 100%) 75%,
        hsl(${hue}, 44%, 83%) 100%
    )`;
}

function changeImageHue(element) {
    let hue = Math.floor(Math.random() * 361);
    element.style.filter = `hue-rotate(${hue}deg)`;
    element.setAttribute("style", `-webkit-filter: hue-rotate(${hue}deg)`);
}

function getElementBounds(group) {
    for (let child of group.children) {
        let tagName = child.tagName.toLowerCase();

        // If the element is a div, select the input element
        if (tagName === "div") child = child.children[0];

        // Don't include the bounds of paragraphs or labels
        if (tagName === "p") continue;

        let bounds = child.getBoundingClientRect();
        let data = {
            class_id: getClassId(child),
            top: Math.round(bounds.top),
            left: Math.round(bounds.left),
        };

        // Declare outside data since they reference info within the object
        data.height = Math.round(Math.abs(data.top - bounds.bottom));
        data.width = Math.round(Math.abs(data.left - bounds.right));

        // Add the data to the array of labels
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
        return CLASS_IDS[type];
    } else if (tagName === "img") {
        let type = element.class;
        return CLASS_IDS[type];
    } else {
        return CLASS_IDS[tagName];
    }
}

function sendLabels() {
    ipc.send("sendLabels", labels);
}

createInterface(10);

console.log(labels);
sendLabels();
