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
	let randNum = Math.floor(Math.random() * 3) + 1;
	switch (randNum) {
		case 1:
			let paragraph = document.createElement("p");
			paragraph.innerHTML = createString(Math.floor(Math.random() * 15) + 1);

			return paragraph;
		case 2:
			let textbox = document.createElement("input");
			textbox.type = "text";
			return textbox;
		case 3:
			let button = document.createElement("button");
			button.innerHTML = createString(Math.floor(Math.random() * 10) + 1);
			return button;
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

createInterface(10);
