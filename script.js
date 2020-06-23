const MAIN_CONTAINER = document.getElementById("main-container");

function createElements() {
	let numElements = Math.floor(Math.random() * 5) + 1;
	let groupDiv = document.createElement("div");
	groupDiv.className = "mini-container";

	for (let i = 0; i < numElements; i++) {
		let element = chooseElement();
		groupDiv.appendChild(element);
	}

	MAIN_CONTAINER.appendChild(groupDiv);
}

function chooseElement() {
	let randNum = Math.floor(Math.random() * 5) + 1;
	switch (randNum) {
		case 1:
			let paragraph = document.createElement("p");
			paragraph.innerHTML =
				Math.random().toString(36).substring(2, 15) +
				Math.random().toString(36).substring(2, 15);
			return paragraph;
		case 2:
			let textbox = document.createElement("input");
			textbox.type = "text";
			return textbox;
		case 3:
			let button = document.createElement("button");
			button.innerHTML = chooseButtonName();
			return button;
		case 4:
			let radio = document.createElement("input");
			radio.type = "radio";
			return radio;
		case 5:
			let dropdown = document.createElement("input");
			dropdown.type = "dropdown";
			return dropdown;
	}
}

function createInterface(numSections) {
	for (let i = 0; i < numSections; i++) {
		createElements();
	}
}

function chooseButtonName() {
	const BUTTON_TEXT = [
		"Click me",
		"Submit",
		"Continue",
		"Activate",
		"Start",
		"Begin",
		"Launch",
		"Cancel",
		"Stop",
		"Pause",
		"Execute",
		"Resume",
		"Run",
		"Increase",
		"Decrease",
	];

	return BUTTON_TEXT[Math.floor(Math.random() * BUTTON_TEXT.length)]; // return a random text selection
}

createInterface(10);
