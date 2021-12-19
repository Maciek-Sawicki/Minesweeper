//TODO
//Naprawić miny żeby 2 razy nie losowały się te same
//restart mapy 
//timer
//Odkrywanie sąsiednich pustych pól
//style dla różnych rozmiarów plansz;



const buttonGeneratorSmall = document.querySelector(".btnSmall"); 
const buttonGeneratorLarge = document.querySelector(".btnLarge"); 
const wrapper = document.querySelector(".wrapper");
const header = document.querySelector("header");
const flagSpan = document.querySelector(".flag");
const title = document.querySelector(".title");
const timeSpan = document.querySelector(".time");
const popup = document.querySelector(".popup");
const tryAgain = document.querySelector(".tryAgain");

let fieldsWithMines = [];
let nearbyMines = [];

let flags = 0;
let time = 0;


const generateBoard = (size , numberOfFlags) => {
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
	// wrapper.classList.remove("sizeLarge");
	// wrapper.classList.add("sizeSmall");

	generateBoardFields(size);
	generateBoardArray(size);

	flags = numberOfFlags;
	flagSpan.innerHTML = flags;
	header.style.display = "block";
	console.log(nearbyMines);
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
		nearbyMines[y] = [];
		for (let x = 0; x < size; x++) {
			nearbyMines[y][x] = 0;
		}
	}
}

const addToArray = (size) => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		if (nearbyMines[field.dataset.y][field.dataset.x] != -1) {
			setNumbersOnFields(size);
		}
	})
	console.log()
}

const showField = (field) => {
	field.classList.remove("hidden");
	field.classList.add("shown");
	field.style.background = "#f2f2f2";
	if (nearbyMines[field.dataset.y][field.dataset.x] == 0) {
		field.innerHTML = "";
		
	}
	else if (nearbyMines[field.dataset.y][field.dataset.x] == -1) {
		field.innerHTML = '<i class="fas fa-bomb"></i>';
	}
	else {
		field.innerHTML = nearbyMines[field.dataset.y][field.dataset.x];
	}
}

// export function revealTile(board, tile) {
// 	if (tile.status !== TILE_STATUSES.HIDDEN) {
// 	  return
// 	}

const showLoseScreen = () => {
	popup.style.display = "flex";
}

const checkIfMineClicked = (field) => {
	const fields = document.querySelectorAll(".field");
	for (let index = 0; index < fieldsWithMines.length; index++) {
		if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
			fields.forEach(field => {
				showField(field);
			})
			setTimeout(() => { showLoseScreen(); }, 1500);
			tryAgain.addEventListener("click" , () => {
				popup.style.display = "none";
			})
		}
	}
}

const leftClick = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		field.addEventListener("click", () => {
			// checkNearbyMines(field.dataset.x, field.dataset.y);
			// console.log(nearbyMines);
			if (field.classList.contains("marked")){
				flags++;
				field.classList.remove("marked");
				field.innerHTML = "";
				flagSpan.innerHTML = flags;
			}
			else {
				showField(field);
			}
			setTimeout(() => { checkIfMineClicked(field) }, 500);
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
				field.innerHTML = '<i class="fas fa-flag"></i>';
				field.classList.add("marked");
			}
		})
	})
}

const startTimerOnce = () => {
	if (!timeToggle) timer();
}

// const startTimer = () => {
// 	timer = true;
// 	time++;
// 	timeSpan.innerHTML = time;
// }

const timer = () => {
	clearInterval();
	timeToggle = false;
	const start = Date.now();
	setInterval(function() {
    	let delta = Date.now() - start; // milliseconds elapsed since start
    	timeSpan.innerHTML = Math.floor(delta / 1000); // in seconds
}, 1000); // update about every second
}

const drawMines = (boardSize, numberOfMines) => {
	fieldsWithMines = [];
	for (let index = 0; index < numberOfMines; index++) {
		fieldsWithMines.push([Math.floor(Math.random() * boardSize), Math.floor(Math.random() * boardSize)]);	
	}
	console.log(fieldsWithMines);
}

const addMinesToArray = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		for (let index = 0; index < fieldsWithMines.length; index++) {
			if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
				nearbyMines[field.dataset.y][field.dataset.x] = -1;
			}
		}
	})
}

const checkMines = () => {
	const fields = document.querySelectorAll(".field");
	fields.forEach(field => {
		for (let index = 0; index < fieldsWithMines.length; index++) {
			if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
				field.innerHTML = '<i class="fas fa-bomb"></i>';
			}
		}
	})
}

const nearbyFields = (x, y, size) => {
    let tab = [];
    // checking 8 nearby fields
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
		for (let offsetY = -1; offsetY <= 1; offsetY++) {
			if (offsetX + x < size && offsetY + y < size && offsetY + y >= 0 && offsetX + x >= 0) {
				const field = {
					x: offsetX + x,
					y: offsetY + y,
				};
				tab.push(field);
			}
		}
    }
    return tab;
}

const setNumbersOnFields = (size) => {
    for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (nearbyMines[y][x] !== -1) {
				let number = 0;
				const Fields = nearbyFields(x, y, size);
				Fields.forEach((field) => {
					if (nearbyMines[field.y]?.[field.x] === -1) number++;
				});
				nearbyMines[y][x] = number;
			}
		}
	}
}

const addListeners = (button, size, numberOfFlags) => {
	button.addEventListener("click", () => generateBoard(size, numberOfFlags));
	button.addEventListener("click", () => drawMines(size, numberOfFlags));
	button.addEventListener("click", addMinesToArray);
	button.addEventListener("click", () => addToArray(size));

	button.addEventListener("click", leftClick);
	button.addEventListener("click", rightClick);
}

const addAnimations = (button) => {
	button.addEventListener("click", () => {
		TweenMax.staggerFrom(".wrapper div", 1, {
			delay: .2, opacity: 0, y: 20, ease: Expo.easeInOut
		}, 0.005)
	})
}

addListeners(buttonGeneratorSmall, 10, 10);
addListeners(tryAgain, 10, 10);

addListeners(buttonGeneratorLarge, 15, 20);

addAnimations(buttonGeneratorSmall);
addAnimations(tryAgain);
addAnimations(buttonGeneratorLarge);







// buttonGeneratorSmall.addEventListener("click", () => generateBoard(10, 10));
// buttonGeneratorSmall.addEventListener("click", () => drawMines(10,10));
// buttonGeneratorSmall.addEventListener("click", addMinesToArray);
// buttonGeneratorSmall.addEventListener("click", addToArray);

// buttonGeneratorSmall.addEventListener("click", leftClick);
// buttonGeneratorSmall.addEventListener("click", rightClick);





// const checkMines = () => {
// 	const fields = document.querySelectorAll(".field");
// 	fields.forEach(field => {
// 		field.addEventListener("click", () => {
// 			for (let index = 0; index < fieldsWithMines.length; index++) {
// 				if ((field.dataset.x == fieldsWithMines[index][0]) && (field.dataset.y == fieldsWithMines[index][1])) {
// 					field.innerHTML = '<i class="fas fa-bomb"></i>';
// 					// nearbyMines[field.dataset.x][field.dataset.y] = -1;
// 				}
// 			}
// 		})
// 	}) 
// }

// const checkNearbyMines = (x, y) => {
// 	let mines = 0;
// 		if ((nearbyMines[y-1]?.[x-1] == -1)) 	mines++;
// 		if ((nearbyMines[y-1]?.[x] == -1))  	mines++;
// 		if ((nearbyMines[y-1]?.[x+1] == -1))  	mines++;
// 		if ((nearbyMines[y][x-1] == -1)) 		mines++;
// 		if ((nearbyMines[y][x+1] == -1))  		mines++;
// 		if ((nearbyMines[y+1]?.[x-1] == -1)) 		mines++;
// 		if ((nearbyMines[y+1]?.[x] == -1)) 		mines++;
// 		if ((nearbyMines[y+1]?.[x+1] == -1)) 	mines++;
// 	nearbyMines[y][x] = mines;
// 	console.log(nearbyMines);
// }

// for (let xOffset = -1; xOffset <= 1; xOffset++) {
// 	for (let yOffset = -1; yOffset <= 1; yOffset++) {
// 		if ((field.dataset.x == xOffset) && (field.dataset.y == yOffset)) {
// 			mines++;
// 		}
// 	}	
// }



// const allNearbyMines = () => {
// 	const fields = document.querySelectorAll(".field");
// 	fields.forEach(field => {
// 		checkNearbyMines(field);
// 	})
// }

// const tile = board[x + xOffset]?.[y + yOffset]
// const numberOfMines = (field.dataset.x + xOffset)?.(field.dataset.y + yOffset)
			// if (numberOfMines) nearbyMines.push(numberOfMines); 	

// buttonGeneratorSmall.addEventListener("click", () => loadFields(100));
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


