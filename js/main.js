/**
 * @file main.js
 * Has an main method to initialize the page and general methods
 *
 * Alexander Winter 
 * 1012
 */

$(main);//call main when document is ready

//default values for theses are the opposite since the click is triggered on load
var showMoves = false; //option to enable hints when selecting a piece, toggled by a button
var rotateBoard = true; //option to rotate the board on everyturn, toggled by a button

var grid, cells, cellsContainers; //jQuery objects for the grid, the cells and the cellsContainers
var dialog; //the dialog used to display messages on the end of the game or when there's a promotion

/**
 * Inits the jquery components and starts the chess game
 * This function is called when document is ready
 */
function main() {
	dialog = $("#dialog"); //selects the dialog element
	dialog.dialog({ autoOpen: false }); //creates the dialog widget

	grid = $("#chessgame"); //selects the chessgame

	grid.grid({ //creates the grid widget
		rowCount: 8, //8x8
		columnCount: 8,
		cellClassFromValuePrefix: "piece", //makes the pieces show an image in css
		autoOnOnClick: false, //the on value is used to indicate a piece has already moved at least once
		useDisplayAdapters: false //do not display text
	});

	$(".numbersContainer").grid({ //make a grid for the 2 lateral divs around the board
		rowCount: 8,
		columnCount: 1,
		useDisplayAdapters: true
	});

	$(".lettersContainer").grid({ //make a grid for the 2 (top/bottom) divs around the board
		rowCount: 1,
		columnCount: 8,
		useDisplayAdapters: true
	});

	$("#chessgame .back, #chessgame .learningJQ-cell-displayAdapter").remove(); //cleaning
	$(".numbersContainer .back, .lettersContainer .back").remove(); //cleaning

	cells = grid.grid("cells"); //selects the cells

	cellsContainers = $("#chessgame .learningJQ-cell-container"); //select the cells container

	$("#chessgame .learningJQ-cell .learningJQ-cell-image").draggable({ //makes the pieces draggable
		start: function() { //when dragged
			var piece = document.elementFromPoint(event.pageX, event.pageY).parentNode.parentNode; //get the piece

			if(locked || !$(piece).cell("option", "value").startsWith(whitesTurn ? 'W' : 'B')) //if the dragged piece isn't the good color
				return false;

			$(this).css({ //reset position and make it over others
				"left": "0",
				"top": "0",
				"z-index": "20"
			});

			//manual unselect
			cells.removeClass("validMove"); //remove validMoves classes
			if(selection != null) //if selection exists
				$(selection).removeClass("selectedPiece"); //remove visual selection
			selection = null; //remove actual selection
			pieceClick(piece); //click on the piece
		},

		stop: function() { //
			$(this).css({ //reset position and make it below others
				"left": "0",
				"top": "0",
				"z-index": "10"
			});

			var element = document.elementFromPoint(event.pageX, event.pageY); //get the div

			if(element == null)
				return;

			if(!$(element).hasClass("ui-draggable")) //if it's not another draggable (best way to test for a chess cell so far)
				return; //get out

			if(element.parentNode == null || element.parentNode.parentNode == null) //if it's not a piece
				return; //get out

			var piece = element.parentNode.parentNode; //take the piece
			pieceClick(piece); //click on the piece
		}
	});

	$("#showMoves").button().on("click", function() {
		showMoves = !showMoves; //toggle option

		if(showMoves) //toggle visual option
			$(this).button({ label: "Cacher les déplacements (rapide)"});
		else {
			$(this).button({label: "Afficher les déplacements (lent)"});
			cells.removeClass("validMove"); //remove moves if the option is set to false
			if(selection != null)
				$(selection).removeClass("selectedPiece");
			selection = null;
		}

	}).trigger("click"); //trigger click instantly to set the text


	$("#rotateBoard").button().on("click", function() {
		rotateBoard = !rotateBoard; //toggle the option

		if (rotateBoard) {
			$(this).button({label: "Désactiver rotation grille"});
			setRotated(!whitesTurn); //make the rotation relative to current turn
		}
		else {
			$(this).button({label: "Activer rotation grille"});
			setRotated(false); //remove rotation
		}
	}).trigger("click"); //auto trigger

	$("#newgame").button().on("click", newGame); //creates a new game button

	//Previously to set background color
	//cells.each(function(x) {
	//	$(this).css("backgroundColor", (x + Math.floor(x / 8)) % 2 == 0 ? "#FFCE9E" : "#D18B47");
	//});

	cells.on("click", function() { //when clicking a cell
		pieceClick(this); //click the piece
	});

	newGame(); //starts a new game
}

/**
 * Shows the page dialog with given caption and message
 * @param caption Title of the dialog to display
 * @param message Message of the dialog to display
 * @param buttons Optional buttons added at the end of the form
 */
function displayMessage(caption, message, buttons) {
	dialog.dialog({ //set dialog options
		title: caption,
		modal: true,
		buttons: buttons
	});
	dialog.html("<p>" + message + "</p>"); //display message
	dialog.dialog("open"); //open it
}

/**
 * Set if the board should be rotated or not
 * @param rotated new state of the board, true if rotated, false if normal
 */
function setRotated(rotated) {
	if(rotated)
	{
		cellsContainers.addClass("rotated"); //css class rotates by 180 deg
		grid.addClass("rotated"); //same

		$(".numbersContainer .learningJQ-cell").each(function(i) {
			$(this).cell({ value: i % 8 + 1}); //set values
		});


		$(".lettersContainer .learningJQ-cell").each(function(i) {
			$(this).cell({ value: String.fromCharCode(7 - i % 8 + 'A'.charCodeAt(0))}); //set char values
		});
	}
	else
	{
		cellsContainers.removeClass("rotated");
		grid.removeClass("rotated");
		$(".numbersContainer .learningJQ-cell").each(function(i) {
			$(this).cell({ value: 8 - i % 8});
		});

		$(".lettersContainer .learningJQ-cell").each(function(i) {
			$(this).cell({ value: String.fromCharCode(i % 8 + 'A'.charCodeAt(0))});
		});
	}
}