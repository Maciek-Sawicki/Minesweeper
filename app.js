//TODO
//style dla różnych rozmiarów plansz;

const mineIcon = '<i class="fas fa-bomb"></i>';
const flagIcon = '<i class="fas fa-flag"></i>';

const buttonGeneratorSmall = document.querySelector(".btnSmall"); 
const buttonGeneratorLarge = document.querySelector(".btnLarge"); 
const wrapper = document.querySelector(".wrapper");
const header = document.querySelector("header");
const flagSpan = document.querySelector(".flag");
const title = document.querySelector(".title");
const timeSpan = document.querySelector(".time");
const timeSpanWin = document.querySelector(".timeWin");
const popupLost = document.querySelector(".popup-lost");
const popupWin = document.querySelector(".popup-win");
const tryAgainS = document.querySelector(".tryAgainSmall");
const tryAgainL = document.querySelector(".tryAgainLarge");
const winS = document.querySelector(".winSmall");
const winL = document.querySelector(".winLarge");

let fieldsWithMines = [];
let board = [];
let fieldsToWin = 0;

let visitedFields = [];
let time;
let firstClick = true;



const generateBoard = (size , numberOfFlags) => {
	clearInterval(time);
	title.style.display = "none";
	wrapper.textContent = "";
	if (size == 15) {
		wrapper.classList.remove("sizeSmall");
		wrapper.classList.add("sizeLarge");
	}
	else {
		wrapper.classList.remove("sizeLarge");
		wrapper.classList.add("sizeSmall");
	}
	generateBoardFields(size);
	generateBoardArray(size); 
	fieldsToWin = (size*size) - numberOfFlags;
	flags = numberOfFlags;
	flagSpan.innerHTML = flags;
	header.style.display = "block";
	// console.log(board);
	
}

const generateBoardFields = (size) => {
	const div = document.createElement("div");
	div.classList.add("field", "hidden");
	div.oncontextmenu="rightClick";
	for (let y = 0; y < size; y++) {
		div.dataset.y = y;
		for (let x = 0; x < size; x++) {
			div.dataset.x = x;
			wrapper.appendChild(div.cloneNode(true));
		}
	}
}

const generateBoardArray = (size) => {
	for (let y = 0; y < size; y++) {
		board[y] = [];
		visitedFields[y] = [];
		for (let x = 0; x < size; x++) {
			board[y][x] = 0;
			visitedFields[y][x] = 0;
		}
	}
}

const addToArray = (size) => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		if (board[field.dataset.y][field.dataset.x] != -1) {
			setNumbersOnFields(size);
		}
	})
}

const setStylesOnFields = (field) => {
	field.classList.remove("hidden");
	field.classList.add("shown");
	field.style.background = "#f2f2f2";

	if (board[field.dataset.y][field.dataset.x] == 0) {
		field.innerHTML = "";
	}

	else if (board[field.dataset.y][field.dataset.x] == -1) {
		field.innerHTML = mineIcon;
	}
	else {
		field.innerHTML = board[field.dataset.y][field.dataset.x];
	}
}

const showField = (field, x,y, size) => {
	const adjacentFields = nearbyFields(x, y, size);

	if (board[field.dataset.y][field.dataset.x] == 0) {
		// console.log("found", x, y);
		adjacentFields.forEach(e => {
			const pole = findField(e.x, e.y); 	
			// console.log("visited",e.x,e.y);
			visitedFields[e.y][e.x] = 1;
			// console.log("V:",visitedFields);
			setStylesOnFields(pole);
			field.innerHTML = "";
		})
	}
	
	else if (board[field.dataset.y][field.dataset.x] == -1) {
		setStylesOnFields(field);
	}
	else {
		setStylesOnFields(field);
	} 
}

const findField = (x, y) => {
	const fields = document.querySelectorAll(".field");
	let fieldReturn = null;
	fields.forEach(field => {
		if ((field.dataset.y == y) && (field.dataset.x == x)) {
			fieldReturn = field;
		}
	})
	return fieldReturn;
}

const showLooseScreen = () => {
	popupLost.style.display = "flex";
}

const checkIfMineClicked = (field) => {
	const fields = document.querySelectorAll(".field");
	for (let index = 0; index < fieldsWithMines.length; index++) {
		if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
			fields.forEach(field => {
				setStylesOnFields(field);
			})
			clearInterval(time);
			setTimeout(() => { showLooseScreen(); }, 1000);
			tryAgainS.addEventListener("click" , () => {
				popupLost.style.display = "none";
			})
			tryAgainL.addEventListener("click" , () => {
				popupLost.style.display = "none";
			})
		}
	}
}

const leftClick = (size) => {
	firstClick = true;
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		field.addEventListener("click", () => {
			if (firstClick) {
				const start = clock();
				time = setInterval(start, 1000);
				firstClick = false;
			}
			
			if (field.classList.contains("marked")){
				flags++;
				field.classList.remove("marked");
				field.innerHTML = "";
				flagSpan.innerHTML = flags;
			}
			else {
				const x = parseInt(field.dataset.x);
				const y = parseInt(field.dataset.y);
				showField(field, x, y, size);
				setTimeout(() => { checkIfMineClicked(field) }, 500);
			}
			setTimeout(() => { checkWin() }, 500);
		})
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
				field.innerHTML = flagIcon;
				field.classList.add("marked");
			}
		})
	})
}

//draw mines and assign to positions on board

const drawMines = (boardSize, numberOfMines) => {
	fieldsWithMines = [];
	fieldOfMinesHash = [];
	while(fieldsWithMines.length !== numberOfMines) {
		let minePosition = ([Math.floor(Math.random() * boardSize), Math.floor(Math.random() * boardSize)]); 
		let hash = 1000*minePosition[0] + minePosition[1];
		if (!fieldOfMinesHash.includes(hash))  {
			fieldsWithMines.push(minePosition);
			fieldOfMinesHash.push(hash);
		}
	}
	// console.log(fieldsWithMines);
}

const addMinesToArray = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		for (let index = 0; index < fieldsWithMines.length; index++) {
			if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
				board[field.dataset.y][field.dataset.x] = -1;
			}
		}
	})
}

const checkMines = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		for (let index = 0; index < fieldsWithMines.length; index++) {
			if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
				field.innerHTML = mineIcon;
			}
		}
	})
}

//count nearby mines

const nearbyFields = (x, y, size) => {
    let fieldsWithNeighbours = [];
    // checking 8 nearby fields
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
		for (let offsetY = -1; offsetY <= 1; offsetY++) {
			if (offsetX + x < size && offsetY + y < size && offsetY + y >= 0 && offsetX + x >= 0) {
				const field = {
					x: offsetX + x,
					y: offsetY + y,
				};
				fieldsWithNeighbours.push(field);
			}
		}
    }
	// console.log(fieldsWithNeighbours);
    return fieldsWithNeighbours;
}

const setNumbersOnFields = (size) => {
    for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			//if position != mine
			if (board[y][x] !== -1) {
				let number = 0;
				const Fields = nearbyFields(x, y, size);
				Fields.forEach((field) => {
					//if mine add +1 to field position
					if (board[field.y]?.[field.x] === -1) number++;
				});
				board[y][x] = number;
			}
		}
	}
}

const clock = () => {
	// firstClick = true;
	let seconds = 0;
	timeSpan.innerHTML = "00";
	const timer = () => {
		
		seconds++;
		if (seconds < 10) {
			timeSpan.innerHTML = "0" + seconds;	
		}
		else {
			timeSpan.innerHTML = seconds;
		}
		
	}
	return timer;
}

const checkWin = () => {
	let shownFields = 0;
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		if (field.classList.contains("shown")) {
			shownFields++;
		}
	})
	if(fieldsToWin === shownFields) {
		clearInterval(time);
		ShowPopupWin();
	}
}

const ShowPopupWin = () => {
	popupWin.style.display = "flex";
	timeSpanWin.innerHTML = timeSpan.innerHTML;
}


const addListeners = (button, size, numberOfFlags) => {
	clearInterval(time);
	button.addEventListener("click", () => generateBoard(size, numberOfFlags));
	button.addEventListener("click", () => drawMines(size, numberOfFlags));
	button.addEventListener("click", addMinesToArray);
	button.addEventListener("click", () => addToArray(size));

	button.addEventListener("click", clock);
	
	button.addEventListener("click", () => leftClick(size));
	button.addEventListener("click", rightClick);
}

const addAnimations = (button) => {
	button.addEventListener("click", () => {
		TweenMax.staggerFrom(".wrapper div", 1, {
			delay: .1, opacity: 0, y: 20, ease: Expo.easeInOut
		}, 0.005)
	})
}

addListeners(buttonGeneratorSmall, 10, 10);
addListeners(buttonGeneratorLarge, 15, 30);
addListeners(tryAgainS, 10, 10);
addListeners(tryAgainL, 15, 30);
addListeners(winS, 10, 10);
addListeners(winL, 15, 30);



addAnimations(buttonGeneratorSmall);
addAnimations(buttonGeneratorLarge);
addAnimations(tryAgainS);
addAnimations(tryAgainL);
addAnimations(winS);
addAnimations(winL);

winS.addEventListener("click" , () => {
	popupWin.style.display = "none";
})
winL.addEventListener("click" , () => {
	popupWin.style.display = "none";
})


