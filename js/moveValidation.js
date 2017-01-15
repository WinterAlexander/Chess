/**
 * @file moves.js
 * Groups movement validation for all pieces.
 * Includes Castling (in the King method) and <i>En Passant</i>
 *
 * Alexander Winter
 * 1012
 */

/**
 * Indicates if a movement is valid for a white pawn.
 * @param fromAddress source address
 * @param toAddress destination address
 * @param action true if the movement validation is final, removing pieces needed for a certain move
 * @returns {boolean} true if the movement is valid
 */
function validWPawnMovement(fromAddress, toAddress, action) {

    if(grid.grid("cellAt", toAddress).cell("option", "value") == "XEmpty") //if destination is empty
    {
        if(lastMoveAsPawn !== null) //if the last move as pawn exists
        {
            //is elligible for a "En Passant" ?
            if(Math.abs(fromAddress.column - toAddress.column) == 1 //horizontal moving is one
                && fromAddress.row == toAddress.row + 1 //vertical moving is one and forward
                && lastMoveAsPawn.column == toAddress.column //Last move as pawn is on the same column as destination
                && lastMoveAsPawn.row == fromAddress.row) //pawn on the same row before the play
            {
                if(action)
                    grid.grid("cellAt", { column: toAddress.column, row: toAddress.row + 1 }).cell({ value: "XEmpty" });
                return true;
            }
        }

        if(fromAddress.column != toAddress.column)
            return false;

        if(fromAddress.row == toAddress.row + 1)
            return true;


        return (grid.grid("cellAt", { row: fromAddress.row - 1, column: fromAddress.column }).cell("option", "value") == "XEmpty"
                && fromAddress.row == toAddress.row + 2
                && fromAddress.row == 6);
    }

    //else it's a capture, return true if the column delta is 1 and the row delta moves foward
    return (Math.abs(fromAddress.column - toAddress.column) == 1) && (fromAddress.row == toAddress.row + 1);
}

/**
 * Indicates if a movement is valid for a black pawn.
 * @param fromAddress source address
 * @param toAddress destination address
 * @param action true if the movement validation is final, removing pieces needed for a certain move
 * @returns {boolean} true if the movement is valid
 */
function validBPawnMovement(fromAddress, toAddress, action) {
    //see comments from validWPawnMovement
    if(grid.grid("cellAt", toAddress).cell("option", "value") == "XEmpty")
    {
        if(lastMoveAsPawn !== null)
        {
            if(Math.abs(fromAddress.column - toAddress.column) == 1
                && fromAddress.row == toAddress.row - 1
                && lastMoveAsPawn.column == toAddress.column
                && lastMoveAsPawn.row == fromAddress.row)
            {
                if(action)
                    grid.grid("cellAt", { column: toAddress.column, row: toAddress.row - 1 }).cell("option", "value", "XEmpty");
                return true;
            }
        }

        if(fromAddress.column != toAddress.column)
            return false;

        if(fromAddress.row == toAddress.row - 1)
            return true;


        return (grid.grid("cellAt", { row: fromAddress.row + 1, column: fromAddress.column }).cell("option", "value") == "XEmpty"
        && fromAddress.row == toAddress.row - 2
        && fromAddress.row == 1);
    }

    return (Math.abs(fromAddress.column - toAddress.column) == 1) && (fromAddress.row == toAddress.row - 1);
}

/**
 * Indicates if the white Rook movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validWRookMovement(fromAddress, toAddress) {
    //if the destination is not linear
    if(Math.abs(fromAddress.row - toAddress.row) != 0 && Math.abs(fromAddress.column - toAddress.column) != 0)
        return false;

    //current address stores a tmp address to iterate until reached the start position
    var currentAddress = { row: toAddress.row, column: toAddress.column };

    while(currentAddress.row > fromAddress.row) { //down
        if(currentAddress.row != toAddress.row && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.row--;
    }

    //will never enter 2 of theses loops
    while(currentAddress.row < fromAddress.row) { //up
        if(currentAddress.row != toAddress.row && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.row++;
    }

    while(currentAddress.column > fromAddress.column) { //rigth
        if(currentAddress.column != toAddress.column && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.column--;
    }

    while(currentAddress.column < fromAddress.column) { //left
        if(currentAddress.column != toAddress.column && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.column++;
    }

    return true;
}

/**
 * Indicates if the black Rook movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validBRookMovement(fromAddress, toAddress) {
    return validWRookMovement(fromAddress, toAddress);
}

/**
 * Indicates if the white Knight movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validWKnightMovement(fromAddress, toAddress) {
    if(Math.abs(fromAddress.row - toAddress.row) == 0 || Math.abs(fromAddress.column - toAddress.column) == 0) //if the movement is linear
        return false;

    return Math.abs(fromAddress.row - toAddress.row) + Math.abs(fromAddress.column - toAddress.column) == 3; //sum of movements should be 3 (2+1)
}

/**
 * Indicates if the black Knight movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validBKnightMovement(fromAddress, toAddress) {
    return validWKnightMovement(fromAddress, toAddress);
}

/**
 * Indicates if the white Bishop movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validWBishopMovement(fromAddress, toAddress) {

    if(Math.abs(fromAddress.row - toAddress.row) == 0 //if on the same row
    || Math.abs(fromAddress.column - toAddress.column) == 0 //or on the same column
    || Math.abs(fromAddress.row - toAddress.row) != Math.abs(fromAddress.column - toAddress.column)) //or not in straight diagonal
        return false;

    var currentAddress = { row: toAddress.row, column: toAddress.column }; //temp value to iterate until back to from address

    while(currentAddress.row > fromAddress.row && currentAddress.column > fromAddress.column) { //down right
        //obstacle detection
        if(currentAddress.row != toAddress.row && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.row--;
        currentAddress.column--;
    }

    //will never enter 2 of theses loops
    while(currentAddress.row < fromAddress.row && currentAddress.column > fromAddress.column) { //up right
        if(currentAddress.row != toAddress.row && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.row++;
        currentAddress.column--;
    }

    while(currentAddress.row > fromAddress.row && currentAddress.column < fromAddress.column) { //down left
        if(currentAddress.row != toAddress.row && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.row--;
        currentAddress.column++;
    }

    while(currentAddress.row < fromAddress.row && currentAddress.column < fromAddress.column) { //down right
        if(currentAddress.row != toAddress.row && grid.grid("cellAt", currentAddress).cell("option", "value") != "XEmpty")
            return false;

        currentAddress.row++;
        currentAddress.column++;
    }

    return true;
}

/**
 * Indicates if the black Bishop movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validBBishopMovement(fromAddress, toAddress) {
    return validWBishopMovement(fromAddress, toAddress);
}

/**
 * Indicates if the white Queen movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validWQueenMovement(fromAddress, toAddress) {
    //a valid Queen movement is a movement valid for a rook OR a bishop
    return validWRookMovement(fromAddress, toAddress) || validWBishopMovement(fromAddress, toAddress);
}

/**
 * Indicates if the black Queen movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @returns {boolean} true if the movement is valid
 */
function validBQueenMovement(fromAddress, toAddress) {
    return validBRookMovement(fromAddress, toAddress) || validBBishopMovement(fromAddress, toAddress);
}

/**
 * Indicates if the white King movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @param action true if the movement validation is final, removing pieces needed for a certain move
 * @returns {boolean} true if the movement is valid
 */
function validWKingMovement(fromAddress, toAddress, action) {
    //ds = distancesquared
    var ds = Math.pow(fromAddress.row - toAddress.row, 2) + Math.pow(fromAddress.column - toAddress.column, 2);

    if(ds <= 2 && ds > 0) //if it's in the adjacent cells
        return true;

    //below is only for the castling move
    //https://en.wikipedia.org/wiki/Castling

    if(ds != 4 || fromAddress.row != toAddress.row) //has to be 4 (2 cell movement on the same direction ds) and has to be on the same row
        return false;

    var king = grid.grid("cellAt", fromAddress); //get the king
    var color = king.cell("option", "value").charAt(0); //get the color to support the black king too

    if(king.cell("option", "on") || !isSafe(king)) //if the king has moved
        return false;

    var dest = grid.grid("cellAt", toAddress); //get the destination
    var towerDest = grid.grid("cellAt", { row: toAddress.row, column: (toAddress.column + fromAddress.column) / 2 }); //get the average between from and to address (between king and his dest)

    if(towerDest.cell("option", "value") != "XEmpty" || !isSafe(towerDest, color)) //check if towerDestination is empty and safe and if it's safe (no need to check if king is safe, that is done after the play anyway)
        return false;

    var tower, preTower;    //tower is the cell supposed to have a tower
                            //preTower is the cell just before, it has to be empty
                            //In case of a 4 cell castling, it's the same as king destination
                            //but king destination has to be empty anyway

    if(fromAddress.column == toAddress.column + 2) //if left
    {
        tower = grid.grid("cellAt", {row: fromAddress.row, column: 0});
        preTower = grid.grid("cellAt", {row: fromAddress.row, column: 1});
    }
    else //if right
    {
        tower = grid.grid("cellAt", {row: fromAddress.row, column: 7});
        preTower = grid.grid("cellAt", {row: fromAddress.row, column: 6});
    }

    if(preTower.cell("option", "value") != "XEmpty") //if it's not empty
        return false;


    if(tower.cell("option", "value") != color + "Rook" || tower.cell("option", "on")) //if the tower cell hasn't a rook of if it has moved
        return false;

    if(action) //if the movement validation is an action, move the tower also
    {
        towerDest.cell({ value: tower.cell("option", "value"), on: true });
        tower.cell({ value: "XEmpty", on: true });
    }
    return true;
}

/**
 * Indicates if the black King movement is valid
 * @param fromAddress source
 * @param toAddress destination
 * @param action true if the movement validation is final, removing pieces needed for a certain move
 * @returns {boolean} true if the movement is valid
 */
function validBKingMovement(fromAddress, toAddress, action) {
    return validWKingMovement(fromAddress, toAddress, action); //function below if polyvalent
}

/**
 * Debug only, called when moving an empty piece
 */
/*function validXEmptyMovement(fromAddress, toAddress, action) {
    console.log(fromAddress);
    console.log(toAddress);
    console.log(action);
    throw new Error('XEmptyMovement called');
}*/