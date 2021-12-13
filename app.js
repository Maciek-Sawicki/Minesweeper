const buttonGeneratorSmall = document.querySelector(".btnSmall"); 
const buttonGeneratorLarge = document.querySelector(".btnLarge"); 
const wrapper = document.querySelector(".wrapper");
const header = document.querySelector("header");
const flagSpan = document.querySelector(".flag");
const title = document.querySelector(".title");
const timeSpan = document.querySelector(".time");

let flags = 0;
let fieldsWithMines = [];
let fields = [];
let time = 0;
let timer = false;

const generateBoard = (size , numberOfFlags) => {
	clearInterval(startTimer);
	title.style.display = "none";
	wrapper.textContent = "";
	const div = document.createElement("div");
	div.classList.add("field");
	div.classList.add("hidden");
	div.oncontextmenu="rightClick";
	wrapper.classList.remove("sizeLarge");
	wrapper.classList.add("sizeSmall");
	console.log(fields);
	for (let y = 0; y < size; y++) {
		div.dataset.y = y;
		for (let x = 0; x < size; x++) {
			div.dataset.x = x;
			wrapper.appendChild(div.cloneNode(true));
		}
	}
	flags = numberOfFlags;
	flagSpan.innerHTML = flags;
	header.style.display = "block";
}

const leftClick = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		field.addEventListener("click", () => {
			startTimerOnce();
			if (field.classList.contains("marked")){
				flags++;
				field.classList.remove("marked");
				flagSpan.innerHTML = flags;
			}
			field.classList.remove("hidden");
			field.classList.add("shown");
			field.style.background = "#f2f2f2";
			field.innerHTML = "";
			console.log("x:", field.dataset.x, "y:",field.dataset.y);
			}
		)
	})
}

const rightClick = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		field.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			if ((field.classList.contains("hidden")) && (flags > 0) && !(field.classList.contains("marked"))) {
				flags--;
				flagSpan.innerHTML = flags;
				field.innerHTML = '<i class="fas fa-flag"></i>';
				field.classList.add("marked");
			}
		})
	})
}

const startTimerOnce = () => {
	if (!timer) setInterval(startTimer, 1000);
}

const startTimer = () => {
	timer = true;
	time++;
	timeSpan.innerHTML = time;
}

const drawMines = (numberofmines, boardSize) => {
	for (let index = 0; index < numberofmines; index++) {
		fieldsWithMines[index] = Math.floor(Math.random() * boardSize);
	}
	console.log(fieldsWithMines);
}











buttonGeneratorSmall.addEventListener("click", () => generateBoard(10, 10));
// buttonGeneratorSmall.addEventListener("click", () => loadFields(100));
buttonGeneratorSmall.addEventListener("click", () => drawMines(10,88));
buttonGeneratorSmall.addEventListener("click", leftClick);
buttonGeneratorSmall.addEventListener("click", rightClick);

// buttonGeneratorLarge.addEventListener("click", generateBoardLarge);
// buttonGeneratorLarge.addEventListener("click", () => loadFields(255));
// buttonGeneratorLarge.addEventListener("click", leftClick);

//buttonGeneratorLarge.addEventListener("click", () = > generateBoardLarge());


// if (Fieldindex == fieldsWithMines[index]) {
// 	field.innerHTML = '<i class="fas fa-bomb"></i>';
// 	field.style.background = "#00ff00";
// }


// let fieldIndex = parseInt(field.classList.item(2));
// 				for (let index = 0; index < fieldsWithMines.length; index++) {
// 					if (fieldIndex == fieldsWithMines.find(() => fieldIndex)) {
// 						field.style.background = "#00ff00";
// 					}
// 				}


//dataset





// const generateBoardSmall = () => {
// 	title.style.display = "none";
// 	wrapper.textContent = "";
// 	const div = document.createElement("div");
// 	div.classList.add("field");
// 	div.classList.add("hidden");
// 	div.oncontextmenu="rightClick";
// 	wrapper.classList.remove("sizeLarge");
// 	wrapper.classList.add("sizeSmall");
// 	console.log(fields);
// 	for (let index = 0; index < 88; index++) {
// 		if (index % 2 == 0) div.style.background = "#4B53F2";
// 		else div.style.background = "#8D92F2";
// 		// div.classList.add(index);
// 		wrapper.appendChild(div.cloneNode(true));
		
// 	}
// 	flags = 10;
// 	flagSpan.innerHTML = flags;
// 	header.style.display = "block";
// }



// const generateBoardLarge = () => {
// 	title.style.display = "none";
// 	wrapper.textContent = "";
// 	const div = document.createElement("div");
// 	div.className = "field";
// 	wrapper.classList.remove("sizeSmall");
// 	wrapper.classList.add("sizeLarge");
// 	for (let index = 0; index < 255; index++) {
// 		if (index % 2 == 0) div.style.background = "#4B53F2";
// 		else div.style.background = "#8D92F2";
// 		wrapper.appendChild(div.cloneNode(true));
// 		// div[index].classList.add(index);
// 	}
// 	flagSpan.innerHTML = "40";
// 	header.style.display = "block";
// }

// const loadFields = () => {
// 	const fields = document.querySelectorAll(".field");
// 	fields.forEach(field => {
// 		field.addEventListener("click", () => {
// 			field.style.background = "#f2f2f2";
// 			console.log(field);

// 		})
// 	})
// }


// const loadFields = (size) => {
// 	const fields = document.querySelectorAll(".field");
// 	console.log(fields)
// 	for (let index = 0; index < size; index++) {
// 		fields[index].classList.add(index);
// 		if (index % 2 == 0) {
// 			fields[index].classList.add("even");
// 		}
// 		else {
// 			fields[index].classList.add("odd");
// 		}
// 	}
// 	return fields;
// }


