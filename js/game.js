/**
 * @file game.js
 * Groups the game logic and grid interaction
 *
 * Alexander Winter
 * 1012
 */
var whitesTurn, selection = null;
var lastMoveAsPawn = null; //saves the address of the last move if the last move was a pawn (for the "En Passant" move)
var inCheck = false;
var locked = true;

/**
 * Starts a new game placing all pieces to their original position.
 */
function newGame() {

    dialog.dialog("close"); //if open (when called from a dialog)

    cells.removeClass("inCheck"); //clean the board from colors
    cells.removeClass("lastMove"); //same

    whitesTurn = true; //white starts
    $("#currentTurn").removeClass("blackTurn").addClass("whiteTurn").text("Blanc"); //Set the current turn div
    setRotated(false); //set not rotated

    cells.cell({ //init the cells
        on: false, //never moved
        value: "XEmpty" //empty
    });

    grid.grid("cellsByCriterias", { row: 1 } ).cell({ value: "BPawn" }); //pawns
    grid.grid("cellsByCriterias", { row: 6 } ).cell({ value: "WPawn" });

    grid.grid("cellAt", { column: 0, row: 0 }).cell({ value: "BRook" }); //rooks
    grid.grid("cellAt", { column: 7, row: 0 }).cell({ value: "BRook" });
    grid.grid("cellAt", { column: 0, row: 7 }).cell({ value: "WRook" });
    grid.grid("cellAt", { column: 7, row: 7 }).cell({ value: "WRook" });

    grid.grid("cellAt", { column: 1, row: 0 }).cell({ value: "BKnight" }); //knights
    grid.grid("cellAt", { column: 6, row: 0 }).cell({ value: "BKnight" });
    grid.grid("cellAt", { column: 1, row: 7 }).cell({ value: "WKnight" });
    grid.grid("cellAt", { column: 6, row: 7 }).cell({ value: "WKnight" });

    grid.grid("cellAt", { column: 2, row: 0 }).cell({ value: "BBishop" }); //bishops
    grid.grid("cellAt", { column: 5, row: 0 }).cell({ value: "BBishop" });
    grid.grid("cellAt", { column: 2, row: 7 }).cell({ value: "WBishop" });
    grid.grid("cellAt", { column: 5, row: 7 }).cell({ value: "WBishop" });

    grid.grid("cellAt", { column: 3, row: 0 }).cell({ value: "BQueen" }); //queens & kings
    grid.grid("cellAt", { column: 4, row: 0 }).cell({ value: "BKing" });
    grid.grid("cellAt", { column: 3, row: 7 }).cell({ value: "WQueen" });
    grid.grid("cellAt", { column: 4, row: 7 }).cell({ value: "WKing" });
    locked = false;
}

/**
 * Called when clicking on a cell
 * @param piece the piece that has been clicked
 */
function pieceClick(piece) {
    if(locked) //can't make a move when the board is locked
        return;

    if(selection == null) { //when no piece is selected
        if($(piece).cell("option", "value") == "XEmpty") //clicking nothing doesn't make anything
            return;

        if(!$(piece).cell("option", "value").startsWith(whitesTurn ? 'W' : 'B')) //clicking an opponent piece neither
            return;

        selection = piece; //select current piece
        $(piece).addClass("selectedPiece"); //add blue border
        displayMoves(piece); //display it's possible moves
    }
    else if(selection == piece) { //when clicking the same piece
        $(piece).removeClass("selectedPiece"); //remove blue border
        cells.removeClass("validMove"); //clean board from possible moves
        selection = null; //unselect
    }
    else if($(selection).cell("option", "value").charAt(0) == $(piece).cell("option", "value").charAt(0)) { //when clicking another piece
        $(selection).removeClass("selectedPiece"); //remove blue border
        cells.removeClass("validMove"); //clean
        selection = piece; //select
        $(piece).addClass("selectedPiece"); //add blue border
        displayMoves(piece); //display possible moves
    }
    else {
        move(selection, piece); //move the piece to destination
        $(selection).removeClass("selectedPiece"); //remove blue border
        cells.removeClass("validMove"); //clean valid moves
        selection = null; //unselect
    }
}

/**
 * Displays the availables moves for a piece
 * @param piece
 */
function displayMoves(piece) {
    if(!showMoves) //if the option isn't enabled
        return;

    cells.each(function () {
        if(this == piece) //can't move on it's own cell
            return;

        if(canMove(piece, this)) //if it can move
            $(this).addClass("validMove"); //decorate
    });
}

/**
 * Moves a piece from a cell to another
 * @param from cell object
 * @param to cell object
 */
function move(from, to) {
    var piece = $(from).cell("option", "value");

    if(piece == "XEmpty")
        return; //Can't move nothing

    if(piece.charAt(0) != (whitesTurn ? 'W' : 'B'))
        return; //Bad turn

    if(!canMove(from, to, true, true))
        return; //Invalid movement

    if(piece.endsWith("Pawn"))
        lastMoveAsPawn = $(to).cell("option", "address");
    else
        lastMoveAsPawn = null;

    $(to).cell({
        value: piece,
        on: true //on means this piece has moved at least one, meaning a moves like Castling aren't possible anymore
    });

    $(from).cell({
        value: "XEmpty",
        on: true
    });

    cells.removeClass("lastMove"); //cleaning
    $(to).addClass("lastMove"); //apply yellow border to last moved

    if(lastMoveAsPawn != null && ($(to).cell("option", "address").row == 0 || $(to).cell("option", "address").row == 7))
        promotePawn(to); //if there's a promotion, the nextTurn function (litteraly the end of this function) is called AFTER the dialog confirmation
    else
        nextTurn(); //else it's just called
}

function nextTurn() {
    dialog.dialog("close"); //if the dialog was open
    whitesTurn = !whitesTurn; //changes the turn

    locked = true;
    var status = lookForCheck();

    setTimeout(function() { //just a small breath when rotating
        if(rotateBoard)  //rotates the board
            setRotated(!whitesTurn);

        if(whitesTurn)
            $("#currentTurn").removeClass("blackTurn").addClass("whiteTurn").text("Blanc");
        else
            $("#currentTurn").removeClass("whiteTurn").addClass("blackTurn").text("Noir");

        if(status == 1) //checkmate
            displayMessage("Échec et mat", "La partie est terminée, le joueur " + (whitesTurn ? "noir" : "blanc") + " a gagné.", { "Nouvelle Partie": newGame});
        else if(status == 2) //draw
            displayMessage("Nulle", "La partie est terminée, c'est une partie nulle.", { "Nouvelle Partie": newGame});
        else
            locked = false; //only unlock if the game isn't finish
    }, rotateBoard ? 500 : 0);
}

/**
 * Looks if the current's king is in check
 * Looks if the current player can move. If
 * he can't and is in check he lost, if he isn't in check it's a draw.
 * @return {number} status, 1 if checkmate, 2 if draw or 0 if nothing
 */
function lookForCheck() {
    cells.removeClass("inCheck"); //cleaning

    var color = whitesTurn ? 'W' : 'B';
    var king = getKing(color);

    inCheck = !isSafe(king, color); //the king is in check if he is not safe
    if(inCheck)
        $(king).addClass("inCheck");

    var atLeastOneMove = false; //checks if there's at least one move that the player can do (with any of his pieces)

    cells.each(function() { //that is slow but I don't have a better to do
        var current = this; //save reference for the inner cells.each

        if($(current).cell("option", "value").charAt(0) != color) //if piece is not owned by current player
            return; //continue

        cells.each(function() { //foreach possible destination
            if(canMove(current, this, true, false)) //if he can move
            {
                atLeastOneMove = true; //marks that he can
                return false; //break
            }
        });

        if(atLeastOneMove)
            return false; //break again
    });

    if(!atLeastOneMove && inCheck) //if no moves and in check (checkmate)
        return 1;
    else if(!atLeastOneMove) //if just no moves
        return 2;

    return 0;
}

/**
 * Indicates if a piece is safe from aggressions or not
 * @param piece to verify
 * @param color color of the player that can be attacked
 * @return {boolean} true is the piece is safe, otherwise false
 */
function isSafe(piece, color) {
    var canKill = false;

    cells.each(function() {

        var current = $(this).cell("option", "value");

        if(current == $(piece).cell("option", "value"))
            return true; //continue

        if(current.startsWith(color) || current.startsWith('X'))
            return true; //equivalent to continue

        if(canMove(this, piece, false)) {
            canKill = true;
            return false; //equivalent to break
        }
    });

    return !canKill;
}

/**
 * Retrieves the king for a player's color
 * @param color W or B
 */
function getKing(color) {
    return grid.grid("cellsByCriterias", { value: color + "King" }); //gets the king using grid method

    //second way to do, the most efficient will be kept
    /*var king = null;
     cells.each(function() {
     if($(this).cell("option", "value") == color + "King") {
     king = this;
     return false;
     }
     });
     return king;*/
}

/**
 * Indicates if a movement is possible from the current player
 * @param fromCell
 * @param toCell
 * @param kingSafety
 * @param action true if the movement validation is final, removing pieces needed for a certain move
 * @returns {boolean}
 */
function canMove(fromCell, toCell, kingSafety, action) {
    kingSafety = typeof kingSafety !== 'undefined' ? kingSafety : true;

    var color = $(fromCell).cell("option", "value").charAt(0);

    if($(toCell).cell("option", "value").startsWith(color))
        return false;

    if($(fromCell).cell("option", "value") == "XEmpty")
        return false;

    var funcName = "valid" + $(fromCell).cell("option", "value") + "Movement";

    if(!window[funcName]($(fromCell).cell("option", "address"), $(toCell).cell("option", "address"), action))
        return false;

    if(!kingSafety)
        return true;

    var backupDest = $(toCell).cell("option", "value");

    $(toCell).cell("option", "value", $(fromCell).cell("option", "value"));
    $(fromCell).cell("option", "value", "XEmpty");

    var safe = isSafe(getKing(color), color);

    $(fromCell).cell("option", "value", $(toCell).cell("option", "value"));
    $(toCell).cell("option", "value", backupDest);

    return safe;
}

/**
 * Lets the user choose which piece he want to
 * promote his pawn into and execute the promotion
 * @param pawn piece to promote
 */
function promotePawn(pawn) {
    var color = $(pawn).cell("option", "value").charAt(0);

    displayMessage("Promotion", "Choisissez une pièce pour la promotion.", [ //display a dialog with 4 buttons for the 4 pieces you can promote into
        {
            text: "Reine",
            click: function() {
                $(pawn).cell({ value: color + "Queen" });
                nextTurn();
            },
            icons: { primary: "ui-icon-" + color + "Queen"}
        },

        {
            text: "Tour",
            click: function() {
                $(pawn).cell({ value: color + "Rook" });
                nextTurn();
            },
            icons: { primary: "ui-icon-" + color + "Rook" }
        },

        {
            text: "Fou",
            click: function() {
                $(pawn).cell({ value: color + "Bishop" });
                nextTurn();
            },
            icons: { primary: "ui-icon-" + color + "Bishop" }
        },

        {
            text: "Cavalier",
            click: function() {
                $(pawn).cell({ value: color + "Knight" });
                nextTurn();
            },
            icons: { primary: "ui-icon-" + color + "Knight" }
        }
    ]);
}