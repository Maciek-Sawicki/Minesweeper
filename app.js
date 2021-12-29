//TODO
//style dla różnych rozmiarów plansz;
//zdażenie wygranej


const mineIcon = '<i class="fas fa-bomb"></i>';
const flagIcon = '<i class="fas fa-flag"></i>';

const buttonGeneratorSmall = document.querySelector(".btnSmall"); 
const buttonGeneratorLarge = document.querySelector(".btnLarge"); 
const wrapper = document.querySelector(".wrapper");
const header = document.querySelector("header");
const flagSpan = document.querySelector(".flag");
const title = document.querySelector(".title");
const timeSpan = document.querySelector(".time");
const popupLost = document.querySelector(".popup-lost");
const tryAgainS = document.querySelector(".tryAgainSmall");
const tryAgainL = document.querySelector(".tryAgainLarge");

let fieldsWithMines = [];
let board = [];
let fieldsToWin = 0;

let visitedFields = [];
// let shown = [];
// let flags = 0;
let time;
let firstClick = true;
// let size = 0;

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
	// fieldsToWin = size*size - numberOfFlags;
	flags = numberOfFlags;
	flagSpan.innerHTML = flags;
	header.style.display = "block";
	console.log(board);
	
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
		// shown[y] = [];
		for (let x = 0; x < size; x++) {
			board[y][x] = 0;
			visitedFields[y][x] = 0;
			// shown[y][x] = -1;
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
	console.log();
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
	// const xx = parseInt(field.dataset.x);
	// const yy = parseInt(field.dataset.y);
	const adjacentFields = nearbyFields(x, y, size);
	// console.log(adjacentFields);

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
	console.log(fieldsWithMines);
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



addAnimations(buttonGeneratorSmall);
addAnimations(tryAgainS);
addAnimations(tryAgainL);
addAnimations(buttonGeneratorLarge);




//to fix
const checkWin = () => {
	const fields = document.querySelectorAll(".field");
	let shownFields = 0;
	fields.forEach(field => {
		if (field.classList.contains("shown")) {
			shownFields++;
			console.log(shownFields);
		}
	})
	if(fieldsToWin === shownFields) {
		ShowPopupWin();
	}
}

const ShowPopupWin = () => {
	alert(" wygrana!");
}


// const startTimer = () => {
// 	timer = true;
// 	time++;
// 	timeSpan.innerHTML = time;
// }

// const timer = () => {
// 	clearInterval();
// 	timeToggle = false;
// 	const start = Date.now();
// 	setInterval(function() {
//     	let delta = Date.now() - start; // milliseconds elapsed since start
//     	timeSpan.innerHTML = Math.floor(delta / 1000); // in seconds
// }, 1000); // update about every second
// }




// function revealStickFields(x, y, size, depth) {
// 	if ((x < 0) || (x >= size)) return;
// 	if ((y < 0) || (y >= size)) return;
// 	if (visitedFields[y][x] > 0) return;
// 	console.table(shown);
// 		console.log(x,y,depth);
// 	if (visitedFields[y][x] == 0)
// 	{
// 		visitedFields[x, y]++;
// 		shown[y][x] = board[y][x];
// 		// console.table(shown);
// 		// console.log(x,y,depth);
// 		//show("Visited", visited);
// 		//show("Shown", shown);

// 		if (board[y][x] == 0) {
// 			revealStickFields(x - 1, y - 1, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x - 1, y, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x - 1, y + 1, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x, y - 1, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x, y + 1, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x + 1, y - 1, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x + 1, y, size, depth++, board, shown, visitedFields);
// 			revealStickFields(x + 1, y + 1, size, depth++, board, shown, visitedFields);
// 		}
// 	}
// }



		//}
			
		// })
		// for (let index = 0; index < adjacentFields.length; index++) {
		// 	const pole = findField(adjacentFields[index].x,adjacentFields[index].y); 
		// 	console.log(index);
		// 	console.log("visited",adjacentFields[index].x,adjacentFields[index].y); 
		// 		visitedFields[adjacentFields[index].y][adjacentFields[index].x]++;
		// 		console.log(visitedFields[adjacentFields[index].y][adjacentFields[index].x]);
		// 		console.log("V:",visitedFields);
		// 		// showField(pole, e.x, e.y, size);
		// 		if (visitedFields[adjacentFields[index].y][adjacentFields[index].x] == 0) {
		// 			whiteField(pole);
		// 		} 
				
		// 		// showField(pole, pole.dataset.x, pole.dataset.y , size);
		// }

// const revealField = (xx, yy) => {
// 	x = parseInt(xx);
// 	y = parseInt(yy);
// 	console.log(x, y);
// 	// console.log(nearbyMines[y][x]);
// 	size = 10;
	
// 	if (x<0) return;
// 	if (y<0) return;
// 	if (y>=size) return;
// 	if (x>=size) return;

// 	//if (visitedFields[y][x] >= 8) return;
	
// 	let field = findField(x, y);
// 	// if (field.classList.contains("shown")) {
// 		// return;
// 	// }
// 	console.log(board[y][x]);
// 	console.log(visitedFields);
// 	if (board[y][x] == 0) {
// 		visitedFields[y][x]++;
// 		//console.log("if",x, y);
// 		field.classList.remove("hidden");
// 		field.classList.add("shown");
// 		field.style.background = "#f2f2f2";

// 		//console.log("x:",x,"y", y);

// 		console.log("1st",x,y);
// 		revealField(x+1, y);
// 		revealField(x+1, y+1);
// 		revealField(x+1, y-1);
// 		//revealField(x-1, y-1);
// 		//revealField(x-1, y+1);
// 		console.log("2st",x,y);
// 		revealField(x-1, y);
// 		//revealField(x+1, y-1);
// 		//revealField(x+1, y+1);
// 		//revealField(x, y-1);
// 		//revealField(x, y+1);	
// 	}
// }

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


