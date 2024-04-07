let catToWords = new Map();
let wordArr = [];
let correctWords = [];
let wordsToCat = new Map();

let clickedCount = 0;

function setUpNewGame() {
	if (localStorage.getItem("firstGame") == null) {
		localStorage.setItem("wins", 0);
		localStorage.setItem("gPlayed", 0);
		localStorage.setItem("streak", 0);
		localStorage.setItem("avg", 0);
		localStorage.setItem("json", 0);
		localStorage.setItem("firstGame", false);
		localStorage.setItem("totGuesses", 0);
		document.getElementById("submit").disabled = true;
	}

	if (localStorage.getItem("correctGuesses") != 4) {
		localStorage.setItem("streak", 0);
	}

	document.getElementById("shuffle").disabled = false;


	document.getElementById("guessHistory").innerHTML = " ";
	localStorage.setItem("history", JSON.stringify([]));
	localStorage.setItem("correctWords", JSON.stringify([]));
	clickedCount = 0;
	document.getElementById("submit").disabled = true;
	localStorage.setItem("categories", null);
	localStorage.setItem("catToWords", null);
	localStorage.setItem("wordsToCat", null);
	localStorage.setItem("board", false);
	localStorage.setItem("correctGuesses", 0);

	catToWords = new Map();
	wordArr = [];
	wordsToCat = new Map();
	//localStorage.setItem("board", false);
	getRandomCategories(makeNewBoard);
	stats();
	//console.log(localStorage.getItem("wins"));
}

function makeNewBoard(newCategories) {
	const categories = newCategories.categories;
	localStorage.setItem("json", JSON.stringify(categories));
	//console.log(localStorage.getItem('json'));
	// console.log(JSON.parse(localStorage.getItem("json")));
	createTable(categories);
}

function createTable(categories) {
	clickedCount = 0;
	document.getElementById("submit").disabled = true;
	wordArr = [];
	const table = document.createElement("table");
	table.className = "board"; //class for table in css

	categories = JSON.parse(localStorage.getItem("json"));

	for (let i = 0; i < 4; i++) {
		let currCat = categories[i]["category"];
		let tempWordGroup = [];

		//const row = document.createElement("tr"); //

		for (let j = 0; j < 4; j++) {
			//const cell_item = document.createElement("td"); //
			//console.log(categories[i]);
			let word = categories[i].words[j];
			tempWordGroup.push(word);
			wordsToCat.set(word, currCat);

			wordArr.push(word);
			//cell_item.innerHTML = word; //gets the words in table //inner html or inner text??

			//cell_item.addEventListener("click", clickCell);
			//row.appendChild(cell_item);
		}
		//table.appendChild(row);
		catToWords.set(currCat, tempWordGroup);
	}

	localStorage.setItem(
		"wordsToCat",
		JSON.stringify(Array.from(wordsToCat.entries()))
	);

	//let numWords_left = 0;

	// for (let i = 0; i < wordArr.length; i++) {
	// 	if (!correctWords.includes(wordArr[i])) {
	// 		numWords_left++;
	// 	}
	// }

	//let rowNum = numWords_left / 4;
	let correctWords = JSON.parse(localStorage.getItem("correctWords"));
	let wordsLeft = wordArr.filter((word) => !correctWords.includes(word));
	let rowNum = wordsLeft.length / 4;

	//console.log("hi", wordsLeft);

	wordsLeft = wordsLeft.sort(() => Math.random() - 0.5); //shuffles the words

	for (let i = 0; i < rowNum; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < 4; j++) {
			const cellIndex = i * 4 + j; //word index
			if (cellIndex < wordsLeft.length) {
				const cell = document.createElement("td");
				cell.innerHTML = wordsLeft[cellIndex];
				cell.addEventListener("click", clickCell);
				row.appendChild(cell); //adding wrd to row
			} else {
				break; //break cuz no more words to add
			}
		}
		table.appendChild(row); // Add the completed row to the table
	}

	//console.log(numWords_left);

	localStorage.setItem(
		"catToWords",
		JSON.stringify(Array.from(catToWords.entries()))
	);
	//console.log(localStorage.getItem("catToWords"));
	// Clear previous table and add the new one to the game board
	const board = document.getElementById("gameboard");

	board.innerHTML = " ";
	board.appendChild(table);
	localStorage.setItem("board", true);
	//console.log(localStorage.getItem("board"));
}

function clickCell(e) {
	// Check if the clicked cell is already selected
	if (e.target.classList.contains("selected")) {
		e.target.classList.remove("selected");
		clickedCount--;
		document.getElementById("submit").disabled = true;
	} else {
		if (clickedCount < 4) {
			e.target.classList.add("selected");
			clickedCount++;
			// localStorage.setItem("gPlayed", 7);
			//  stats();
			document.getElementById("submit").disabled = true;
		} else {
			alert("Maximum of 4 cells can be selected at a time");
		}
	}

	if (clickedCount == 4) {
		document.getElementById("submit").disabled = false;
	}
}
function stats() {
	var statsDiv = document.querySelector(".stats");

	statsDiv.querySelector("#gamesPlayed").innerHTML =
		localStorage.getItem("gPlayed");
	statsDiv.querySelector("#gamesWon").innerHTML = localStorage.getItem("wins");
	statsDiv.querySelector("#winStreak").innerHTML =
		localStorage.getItem("streak");
	statsDiv.querySelector("#avgGuess").innerHTML = localStorage.getItem("avg");
}

function clearHistory() {
	localStorage.clear();
	setUpNewGame();
}

function increaseGamesPlayed() {
	let gamesPlayed = parseInt(localStorage.getItem("gPlayed"));
	gamesPlayed += 1;
	localStorage.setItem("gPlayed", gamesPlayed);
	localStorage.setItem(
		"avg",
		(
			parseInt(localStorage.getItem("totGuesses")) /
			localStorage.getItem("gPlayed")
		).toFixed(2)
	);
	stats();
}

function submitHandler() {
	// Find all selected cells
	let clickedBoxes = document.querySelectorAll(".selected");
	let subWords = [];

	clickedBoxes.forEach((box) => {
		subWords.push(box.innerHTML);
	});

	//console.log(JSON.parse(localStorage.getItem("wordsToCat")));

	let wtc = new Map(JSON.parse(localStorage.getItem("wordsToCat"))); //words to cat

	if (
		wtc.get(subWords[0]) == wtc.get(subWords[1]) &&
		wtc.get(subWords[1]) == wtc.get(subWords[2]) &&
		wtc.get(subWords[2]) == wtc.get(subWords[3])
	) {
		console.log("Correct!");
		let correctWords = JSON.parse(localStorage.getItem("correctWords"));
		subWords.forEach((word) => {
			correctWords.push(word);
		});
		localStorage.setItem("correctWords", JSON.stringify(correctWords));
		//console.log(correctWords);
		createTable(JSON.parse(localStorage.getItem("json")));

		localStorage.setItem(
			"correctGuesses",
			parseInt(localStorage.getItem("correctGuesses")) + 1
		);
		console.log("category: ", wtc.get(subWords[0]));

		const hist = document.getElementById("guessHistory");
		const histItem = document.createElement("li");
		histItem.innerHTML =
			"Correct Guess: " +
			subWords[0] +
			", " +
			subWords[1] +
			", " +
			subWords[2] +
			", " +
			subWords[3] +
			" - Category: " +
			wtc.get(subWords[0]);
		hist.appendChild(histItem);

		if (parseInt(localStorage.getItem("correctGuesses")) == 4) {
			localStorage.setItem("wins", parseInt(localStorage.getItem("wins")) + 1);
			localStorage.setItem(
				"streak",
				parseInt(localStorage.getItem("streak")) + 1
			);
			localStorage.setItem(
				"avg",
				(
					parseInt(localStorage.getItem("totGuesses")) /
					localStorage.getItem("gPlayed")
				).toFixed(2)
			);

			const hist = document.getElementById("guessHistory");
			const histItem = document.createElement("li");
			histItem.innerHTML = "GAME OVER! You Won! Click New Game To Play Again!";
			hist.appendChild(histItem);

			stats();
		}
	} else {
		let gCats = [];

		for (let i = 0; i < 4; i++) {
			gCats.push(wtc.get(subWords[i]));
		}

		let countMap = new Map(); // Object to store counts

		// Loop through the gCats array
		gCats.forEach((item) => {
			if (countMap.has(item)) {
				countMap.set(item, countMap.get(item) + 1);
			} else {
				countMap.set(item, 1);
			}
		});

		let countArr = [];
		console.log(countMap);

		for (let [key, value] of countMap) {
			countArr.push(value);
		}

		let maxSim = Math.max(...countArr);

		console.log(countMap);

		const hist = document.getElementById("guessHistory");
		const histItem = document.createElement("li");

		if (maxSim < 2) {
			histItem.innerHTML =
				"Incorrect Guess: " +
				subWords[0] +
				", " +
				subWords[1] +
				", " +
				subWords[2] +
				", " +
				subWords[3];
			hist.appendChild(histItem);
			//console.log("Incorrect!");
		} else {
			histItem.innerHTML =
				"Incorrect Guess: " +
				subWords[0] +
				", " +
				subWords[1] +
				", " +
				subWords[2] +
				", " +
				subWords[3] +
				"<br> You Had " +
				maxSim +
				" Words From The Same Category";

			hist.appendChild(histItem);
		}
	}

	localStorage.setItem(
		"totGuesses",
		parseInt(localStorage.getItem("totGuesses")) + 1
	);
}

let newGameButton = document.getElementById("newgame");
newGameButton.addEventListener("click", setUpNewGame);
newGameButton.addEventListener("click", increaseGamesPlayed);

let clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearHistory);

let shuffButton = document.getElementById("shuffle");
shuffButton.addEventListener("click", createTable);

let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", submitHandler);
