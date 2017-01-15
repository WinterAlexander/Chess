 jQuery(function() {
    // **********************************************************************************************************************************
    // Addon to the Math class
    // **********************************************************************************************************************************
    // Return a random number between pMin and pMax (both min and max included)
    if(Math.randomBetween === undefined) {
        Math.randomBetween = function(pMin, pMax) {
            var that = this,
                result;
            
            return (Math.floor(Math.random() * (pMax + 1)) + pMin);
        };
    }
    // **********************************************************************************************************************************

    // **********************************************************************************************************************************
    // Addon to the Array class
    // **********************************************************************************************************************************
    // Return a random index for the Array (between 0 and the Array length - 1)
    if(Array.prototype.randomIndex === undefined) {
        Array.prototype.randomIndex = function() {
            var that = this;
            
            return Math.randomBetween(0, that.length-1);
        };
    }
    // **********************************************************************************************************************************

    // **********************************************************************************************************************************
    // Addon to jQuery
    // **********************************************************************************************************************************
    // Simplify the action of throwing a new Error
    // and Standardize the message of the error
    if(jQuery.throwNewError === undefined) {
        jQuery.throwNewError = function(name, desc, values) {
            var msg = name + ': ' + desc,
                val = jQuery.extend({}, values);
            
            if(!jQuery.isEmptyObject(val)) {
                msg += ' [';
                jQuery.each(val, function(key, value) {
                    msg += key + ': ' + value;
                });
                msg += ']';
            }
            throw new Error(msg);
        };
    }
    // **********************************************************************************************************************************

    // **********************************************************************************************************************************
    // Grid Widget
    // **********************************************************************************************************************************
    jQuery.widget( "learningJQ.grid", {
        version: "1.1.0",
        // List of classes osed by the widget
        _classes: {
            main: 'learningJQ-GRID'           
        },   
        // Pair of key/value wher the key is the event catched by the GRID widget
        // and the value is the corresponding event that the GRID widget has to trigger
        _cellEvents: {
            cellclick: {gridEventName: 'click', isListeningOn: []},
            cellrightclick: {gridEventName: 'rightclick', isListeningOn: []},
            celldblclick: {gridEventName: 'dblclick', isListeningOn: []},
            cellkeydown: {gridEventName: 'keydown', isListeningOn: []},
            cellkeypress: {gridEventName: 'keypress', isListeningOn: []},
            cellkeyup: {gridEventName: 'keyup', isListeningOn: []},
            cellmousedown: {gridEventName: 'mousedown', isListeningOn: []},
            cellmouseup: {gridEventName: 'mouseup', isListeningOn: []},
            cellmouseover: {gridEventName: 'mouseover', isListeningOn: []},
            cellmouseout: {gridEventName: 'mouseout', isListeningOn: []},
            cellmouseenter: {gridEventName: 'mouseenter', isListeningOn: []},
            cellmouseleave: {gridEventName: 'mouseleave', isListeningOn: []},
            cellchangedisabledstate: {gridEventName: 'cellChangeDisabledState', isListeningOn: []},
            cellchangeselectedstate: {gridEventName: 'cellChangeSelectedState', isListeningOn: []},
            cellchangeonstate: {gridEventName: 'cellChangeOnState', isListeningOn: []},
            cellchangeflippedstate: {gridEventName: 'cellChangeFlippedState', isListeningOn: []},
            cellchangecolor: {gridEventName: 'cellChangeColor', isListeningOn: []},
            cellchangevalue: {gridEventName: 'cellChangeValue', isListeningOn: []},
            cellchangebackgroundcolor: {gridEventName: 'cellChangeBackgroundColor', isListeningOn: []},
            cellchangeimage: {gridEventName: 'cellChangeImage', isListeningOn: []},
            cellchangebackvalue: {gridEventName: 'cellChangeBackValue', isListeningOn: []},
            cellchangebackbackgroundcolor: {gridEventName: 'cellChangeBackBackgroundColor', isListeningOn: []},
            cellchangebackimage: {gridEventName: 'cellChangeBackImage', isListeningOn: []},
            cellchangeddisabledstate: {gridEventName: 'cellChangedDisabledState', isListeningOn: []},
            cellchangedselectedstate: {gridEventName: 'cellChangedSelectedState', isListeningOn: []},
            cellchangedonstate: {gridEventName: 'cellChangedOnState', isListeningOn: []},
            cellchangedflippedstate: {gridEventName: 'cellChangedFlippedState', isListeningOn: []},
            cellchangedcolor: {gridEventName: 'cellChangedColor', isListeningOn: []},
            cellchangedvalue: {gridEventName: 'cellChangedValue', isListeningOn: []},
            cellchangedbackgroundcolor: {gridEventName: 'cellChangedBackgroundColor', isListeningOn: []},
            cellchangedimage: {gridEventName: 'cellChangedImage', isListeningOn: []},
            cellchangedbackvalue: {gridEventName: 'cellChangedBackValue', isListeningOn: []},
            cellchangedbackbackgroundcolor: {gridEventName: 'cellChangedBackBackgroundColor', isListeningOn: []},
            cellchangedbackimage: {gridEventName: 'cellChangedBackImage', isListeningOn: []}
        },
        options: {
            // Grid Widget Options
            rowCount: 0,
            columnCount: 0,
            displayType: 'text',
            imagePath: '',
            autoSizeCells: false,
            allowMultiSelect: false,
            useDisplayAdapters: true,
            
            preventSelectIfNotOn: false,
            preventSelectIfDisabled: false,
            preventSelectIfFlipped: false,
            
            preventOnIfSelected: false,
            preventOnIfDisabled: false,
            preventOnIfFlipped: false,
            
            preventDisableIfNotOn: false,
            preventDisableIfSelected: false,
            preventDisabledIfFlipped: false,
            
            preventFlippedIfNotOn: false,
            preventFlippedIfDisabled: false,
            preventFlippedIfSelected: false,
            
            autoSelectOnClick: false,
            autoOnOnClick: false,
            autoDisableOnClick: false,
            autoFlipOnClick: false,

            autoSelectOnRightClick: false,
            autoOnOnRightClick: false,
            autoDisableOnRightClick: false,
            autoFlipOnRightClick: false,

            flip: false,
            initCellsOn: false,
            initCellsSelected: false,
            initCellsDisabled: false,
            initCellsFlipped: false,
			
			cellClassFromValuePrefix: '',   
			cellValues: [],
     
            // callbacks for widget events
            change: null,
            
            // callbacks for mouse and keyboard events
            click: null,
            rightclick: null,
            dblclick: null,
            keydown: null,
            keypress: null,
            keyup: null,
            mousedown: null,
            mouseup: null,
            mouseover: null,
            mouseout: null,
            mouseenter: null,
            mouseleave: null,
            
            // callbacks for cell events
            cellChangeDisabledState: null,
            cellChangeSelectedState: null,
            cellChangeOnState: null,
            cellChangeFlippedState: null,
            cellChangeValue: null,
            cellChangeColor: null,
            cellChangeBackgroundColor: null,
            cellChangeImage: null,
			
            cellChangedDisabledState: null,
            cellChangedSelectedState: null,
            cellChangedOnState: null,
            cellChangedFlippedState: null,
            cellChangedValue: null,
            cellChangedColor: null,
            cellChangedBackgroundColor: null,
            cellChangedImage: null,
        },
        // the constructor
        _create: function(options) {
                // Keep a reference to this
            var _self = this,
                options = {};
            
            // If the DOM element already has the learningJQ-GRID class
            if(_self.element.hasClass(_self._classes.main)) {
                // Loop the data attributes of the DOM element
                jQuery.each(_self.element.data(), function(key, value) {
                    // If the data attribute matches the name of a GRID Widget option
                    if(_self.options.hasOwnProperty(key)) {
                        // Add the option to the options variable.
                        options[key] = value;
                    }
                });
                _self.element
                    // remove all child elements that does not have the learningJQ-cell class
                    .children(':not(.' + jQuery.learningJQ.cell.prototype._classes.main + ')')
                        .remove();
            }
            else {
                _self.element
                    // Add the GRID Widget's class
                    .toggleClass( _self._classes.main, true )
                    // empty the element
                    .empty();
            }
            
            _self.element
                // prevent double click to select test.html
                .disableSelection();
                
            _self.element.on('contextmenu', function(e){e.preventDefault();});
 
            // If there were options
            if(jQuery.map(options, function(key, value) {return [value];}).length) {
                // Update options (this will automatically trigger the refresh)
                // Set all options gathered in the options variable
                _self.option(options);
            }
            else {
                // call the refresh function
                _self._refresh();
            }
        },
        // called when changing options
        _refresh: function() {
                // Keep a reference to this
            var _self = this,
                // used to store the previous element of the one we are working on
                prev = undefined;
            
            // Remove all CELLS from unnecessary rows.
            _self.cellsByCriterias({row: {min: _self.options.rowCount}})
                    .remove();
            // Remove all CELLS from unnecessary columns.
            _self.cellsByCriterias({column: {min: _self.options.columnCount}})
                    .remove();

// ToDo: Loop through the GRID childs and initialize all existing CELLS that are not already initialized
            
            // Loop through the required rows
            for (var row = 0; row < _self.options.rowCount ; row++ )
            {
                // For each row, loop through the required columns
                for (var col = 0; col < _self.options.columnCount; col++) {
                        // calculate the index of the cell at row row and column col
                    var index = (row * _self.options.columnCount + col),
                        // Get the cell at the current row and column
                        elem = _self.cellsByCriterias({row: row, column: col});

                    // If no cell were found for the current row and column
                    if(!elem.length) {
                        // Create a new div element
                        elem = jQuery("<div>");

                        if(prev) {
                            // If a previous element is defined, insert 
                            // the new element after the previous element
                            prev.after(elem)
                        }
                        else {
                            // If no previous element is defined,
                            // append the new element th the GRID
                            _self.element.append(elem);
                        }
                        
                        // Initialise the cell Widget on the new element
                        jQuery(elem).cell({
                            parentGrid: _self.element[0], 
                            value: (_self.options.cellValues.length > index ? _self.options.cellValues[index] : 0), 
                            address: {index: index, row: row, column: col}, 
                            autoSize: _self.options.autoSizeCells, 
                            displayType: _self.options.displayType,
                            changeSelectedState: ((!_self.options.allowMultiSelect || _self.options.cellChangeSelectedState) ? (_self.options.cellChangeSelectedState ? jQuery.proxy(_self._handleEvents, _self) : _self.options.cellChangeSelectedState) : null),
                            changedSelectedState: ((!_self.options.allowMultiSelect || _self.options.cellChangedSelectedState) ? (_self.options.cellChangedSelectedState ? jQuery.proxy(_self._handleEvents, _self) : _self.options.cellChangedSelectedState) : null),
//                            click: ((_self.options.autoSelectOnClick || _self.options.autoFlipOnClick) ? (_self.options.click ? jQuery.proxy(_self._handleEvents, _self) : _self.options.click) : null)
                            click: jQuery.proxy(_self._handleEvents, _self),
                            rightclick: jQuery.proxy(_self._handleEvents, _self),
                            selected: _self.options.initCellsSelected,
                            on: _self.options.initCellsOn,
                            disabled: _self.options.initCellsDisabled,
                            flip: _self.options.flip,
                            flipped: (_self.options.flip && _self.options.initCellsFlipped), 
							cellClassFromValuePrefix: _self.options.cellClassFromValuePrefix,
							useDisplayAdapters: _self.options.useDisplayAdapters
                        });
/*
                        if(!_self.options.allowMultiSelect && _self._cellEvents.cellchangeselectedstate.isListeningOn.indexOf(elem) == -1) {
                            jQuery(elem).cell('option', 'changeSelectedState', jQuery.proxy(_self._handleEvents, _self));
                            jQuery(elem).cell('option', 'changedSelectedState', jQuery.proxy(_self._handleEvents, _self));
                            _self._cellEvents.cellchangeselectedstate.isListeningOn.push(elem[0]);
                            _self._cellEvents.cellchangedselectedstate.isListeningOn.push(elem[0]);
                        }
                        if((_self.options.autoSelectOnClick || _self.options.autoFlipOnClick) && _self._cellEvents.cellclick.isListeningOn.indexOf(elem) == -1) {
                            jQuery(elem).cell('option', 'click', jQuery.proxy(_self._handleEvents, _self));
                            _self._cellEvents.cellclick.isListeningOn.push(elem[0]);
                        }
*/
                    }
                    else {
                        // If a cell was found, we refresh some of it's options with the current values of the GRID widget options
                        jQuery(elem).cell('option', {address: {index: index, row: row, column: col}, autoSize: _self.options.autoSizeCells, displayType: _self.options.displayType});
                    }
                    
                    // Set the current element as the previous one for the next element of the GRID
                    prev = elem.parent();
                }
            }
            // trigger a callback/event
            _self._trigger( "change", jQuery.Event(), {gridElement: _self.element} );
        },
        // Return the length of the GRID (the number of CELLS)
        length: function() {
            // return the number of row multiplied by the number of columns
            return this.options.rowCount * this.options.columnCount;
        },
        // Return a cell index ramdomly
        randomIndex: function() {
            // Return a number between 0 and the number of cell - 1.
            return Math.randomBetween(0, (this.length()-1));
        },
        // Return a column index ramdomly.
        randomColumnIndex: function() {
            // Return a number between 0 and columnCount - 1.
            return Math.randomBetween(0, (this.options.columnCount-1));
        },
        // Return a row index randomly
        randomRowIndex: function() {
            // Return a number between 0 and rowCount - 1.
            return Math.randomBetween(0, (this.options.rowCount-1));
        },
        // Return the all the GRID CELLS
        cells: function() {
            // Return all the GRID CELLS by selecting all the CELLS of the GRID
            return this.element.find('.learningJQ-cell');
        },
        // Return the GRID CELLS that matches the provided criterias. Any cell option can be used as a criteria.
        // The crit parameter object contains key/value pairs to determine wich CELLS to return. The value of each key can be any of the 3 following:
        //      1- The actual value (Either a string or a number)
        //      2- An Object with the min and/or max properties set
        //      3- An Array of desired values
        cellsByCriterias: function(crit) {
                // Keep a reference to this
            var _self = this,
                co = jQuery.learningJQ.cell.prototype.options;

            // Make sure the crit value is an object
            if(typeof crit !== "object") {
                jQuery.throwNewError('Invalid data type', 'The expected type for the criterias parameter is an object', {value: crit});
            }
            // Loop through all criterias to make sure the key is an existing cell option
            jQuery.each(crit, function(key, value) {
                if(co[key] === undefined && co.address[key] === undefined) {
                    jQuery.throwNewError('Invalid option', 'At least one of the option(s) provided are invalid', {value: crit});
                }
            });
            // Return all the GRID CELLS by selecting all the CELLS of
            // the GRID and filtering based on the provided ctiterias
            return _self.element
                        .find('.' + jQuery.learningJQ.cell.prototype._classes.main)
                        .filter(function() {
                                // Get the curent cell options
                            var cellOptions = jQuery(this).cell('option'),
                                keep = true;
                            
                            // Bring back index, row and column to the root of the cellOptions object
                            cellOptions.index = cellOptions.address.index;
                            cellOptions.row = cellOptions.address.row;
                            cellOptions.column = cellOptions.address.column;

                            // For each criterias received
                            jQuery.each(crit, function(key, value) {
                                // If value is not an object
                                if(typeof value !== "object") {
                                    // Consider it is the desired value and test 
                                    // if the option value for the option matches
                                    // return false if not
                                    if(cellOptions[key] !== value) {
                                        keep = false;
                                        return false;
                                    }
                                }
                                else {
                                    // If the value is an object
                                    
                                    // If it is an Array
                                    if(value instanceof Array) {
                                        // Test if the cell value for the option 
                                        // is found in the array of desired values
                                        // return false if not
                                        if(value.indexOf(cellOptions[key]) === -1) {
                                            keep = false;
                                            return false;
                                        }
                                    }
                                    else {
                                        // Considered the value to be an object with min and/or max value properties
                                        
                                        // Test if the min property is set and that the cell value
                                        // for the option is greter or equal to the desired min value
                                        // return false if not
                                        if(value.min !== undefined && cellOptions[key] < value.min) {
                                            keep = false;
                                            return false;
                                        }
                                        // Test if the max property is set and that the cell value
                                        // for the option is less or equal to the desired max value
                                        // return false if not
                                        if(value.max !== undefined && cellOptions[key] > value.max) {
                                            keep = false;
                                            return false;
                                        }
                                    }
                                }
                            });
                            // Return keep.
                            return keep;
                        });
        },
        // Return all the CELLS of a row
        cellsFromRow: function(row) {
            // If the row index provided is out of range
            if(row < 0 || row >= this.options.rowCount) {
                jQuery.throwNewError('Invalid Row Index Value', 'The provided row index is not a valid row index. Must be between 0 and ' + (this.options.rowCount-1) + '.', {row: row});
            }
            return this.cellsByCriterias({row: row});
        },
        // Return all the CELLS of a column
        cellsFromColumn: function(col) {
            if(col < 0 || col >= this.options.columnCount) {
                // An error was returned, throw the exception with the proper message from the Validator Class
                jQuery.throwNewError('Invalid Column Index Value', 'The provided column index is not a valid column index. Must be between 0 and ' + (this.options.columnCount-1) + '.', {column: col});
            }
            return this.cellsByCriterias({column: col});
        },
        // Return all the CELLS of a range
        cellsFromRange: function(addrStart, addrEnd) {
                // Keep a reference to this
            var aStart = this._cellAddress(addrStart),
                aEnd = this._cellAddress(addrEnd);

            // Return the range CELLS
            return this.cellsByCriterias({
                        row: {
                            min: aStart.row,
                            max: aEnd.row
                        },
                        column: {
                            min: aStart.column,
                            max: aEnd.column
                        }
                    });
        },
        // Return the selected CELLS
        cellsSelected: function() {
            return this.cellsByCriterias({selected: true});
        },
        // Return the selected CELLS
        cellsFlipped: function() {
            return this.cellsByCriterias({flipped: true});
        },
        // Return the cell at the specified address
        cellAt: function(addr) {
            // Return the specified cell
            return this.cellsByCriterias({index: this._cellAddress(addr).index});
        },
        // Return the index of all the selected CELLS as an array
        selectedIndexes: function() {
                // Keep a reference to this
            var _self = this,
                indexes = [];
                
            _self.cellsByCriterias({selected: true})
                    .each(function(){
                        // add the cell index to the index array
                        indexes.push(jQuery(this).cell('option', 'index'));
                    });
                    
            // return the selected indexes
            return indexes;
        },
        // Return the address of all the selected CELLS as an array
        selectedAddresses: function() {
                // Keep a reference to this
            var _self = this,
                addresses = [];
                
            _self.cellsByCriterias({selected: true})
                    .each(function(){
                        addresses.push(jQuery(this).cell('addressInfo'));
                    });
            
            // return the selected indexes
            return addresses;
        },
        // return an address (row, column and index) based on the value passed
        _cellAddress: function(addr) {
                // Keep a reference to object this
            var _self = this,
                // Determine if the index is part of addr object or if addr is the index
                index = addr.index === undefined ? addr : addr.index,
                cell;
            
            // If addr is an object
            if(typeof addr === "object") {
                // Row and Column Index are provided
                
                // If the addr parameter does not contain a valid row property, throw an error
                if(addr.row === undefined || addr.row < 0 || addr.row >= _self.options.rowCount) {
                    jQuery.throwNewError('Invalid Row Index Value', 'The provided row index is not a valid row index. Must be between 0 and ' + (_self.options.rowCount-1) + '.', {row: addr.row});
                }
                // If the addr parameter does not contain a valid column property, throw an error
                if(addr.column === undefined || addr.column < 0 || addr.column >= _self.options.columnCount) {
                    jQuery.throwNewError('Invalid Column Index Value', 'The provided column index is not a valid column index. Must be between 0 and ' + (_self.options.columnCount-1) + '.', {column: addr.column});
                }
                // Set the index value using row and column indexes
                index = (addr.row * _self.options.columnCount + addr.column);
            }
            else {
                // addr is actually the index
                // If the addr parameter is not a valid index, throw an error
                if(addr === undefined || addr < 0 || addr >= _self.options.rowCount * _self.options.columnCount) {
                    jQuery.throwNewError('Invalid Cell Index Value', 'The provided cell index is not a valid cell index. Must be between 0 and ' + (_self.options.rowCount*_self.options.columnCount-1) + '.', {index: addr});
                }
            }
            // Return the address option of the cell at the index we just determined
            return _self.element.find('.' + jQuery.learningJQ.cell.prototype._classes.main + ':eq(' + index + ')').cell('option', 'address');
        },
        // This function is called when a cell selction is being made
        _handleNotMultiSelect: function(elem) {
            // If the GRID option allowMiltiSelect is set to false and 
            // the cell is currently not selected (it will then be selected)
            if(!this.options.allowMultiSelect && !elem.cell('option', 'selected')) {
                // Unselect all selected CELLS except for the current one
                
                // Get all selected CELLS
                this.cellsByCriterias({selected: true})
                    // Except the current one
                    .not(elem)
                    // call the option method setting their selected option to false
                    .cell('option', 'selected', false);
            }
        },
        // Function that handles cell events in order to trigger the corresponding GRID event
        _handleEvents: function(e, args) {
            // If the GRID triggered event is a click and the GRID's option autoSelectOnClick is set to true
            if(this._cellEvents[e.type].gridEventName === 'click') {
                if(this.options.autoSelectOnClick) {
                    if((jQuery(args.cellElement).cell('option', 'on') || !this.options.preventSelectIfNotOn) &&
                       (!jQuery(args.cellElement).cell('option', 'disabled') || !this.options.preventSelectIfDisabled) &&
                       (!jQuery(args.cellElement).cell('option', 'flipped') || !this.options.preventSelectIfFlipped)) {
                        // Call the method to handle the GRID multi-select option
                        this._handleNotMultiSelect(jQuery(args.cellElement));
                        // Call the cell's method to toggle it's selected state
                        jQuery(args.cellElement).cell('toggleSelected');
                    }
                }
                if(this.options.autoOnOnClick) {
                    if((!jQuery(args.cellElement).cell('option', 'selected') || !this.options.preventOnIfSelected) &&
                       (!jQuery(args.cellElement).cell('option', 'disabled') || !this.options.preventOnIfDisabled) &&
                       (!jQuery(args.cellElement).cell('option', 'flipped') || !this.options.preventOnIfFlipped)) {
                        // Call the cell's method to toggle it's On state
                        jQuery(args.cellElement).cell('toggleOn');
                    }
                }
                if(this.options.autoDisableOnClick) {
                    if((jQuery(args.cellElement).cell('option', 'on') || !this.options.preventDisableIfNotOn) &&
                       (!jQuery(args.cellElement).cell('option', 'selected') || !this.options.preventDisableIfSelected) &&
                       (!jQuery(args.cellElement).cell('option', 'flipped') || !this.options.preventDisabledIfFlipped)) {
                        // Call the cell's method to toggle it's disabled state
                        jQuery(args.cellElement).cell('toggleDisabled');
                    }
                }
                if(this.options.autoFlipOnClick) {
                    if((jQuery(args.cellElement).cell('option', 'on') || !this.options.preventFlippedIfNotOn) &&
                       (!jQuery(args.cellElement).cell('option', 'disabled') || !this.options.preventFlippedIfDisabled) &&
                       (!jQuery(args.cellElement).cell('option', 'selected') || !this.options.preventFlippedIfSelected)) {
                        // Call the cell's method to toggle it's flipped state
                        jQuery(args.cellElement).cell('toggleFlipped');
                    }
                }
            } else if(this._cellEvents[e.type].gridEventName === 'rightclick') {
                if(this.options.autoSelectOnRightClick) {
                    if((jQuery(args.cellElement).cell('option', 'on') || !this.options.preventSelectIfNotOn) &&
                       (!jQuery(args.cellElement).cell('option', 'disabled') || !this.options.preventSelectIfDisabled) &&
                       (!jQuery(args.cellElement).cell('option', 'flipped') || !this.options.preventSelectIfFlipped)) {
                        // Call the method to handle the GRID multi-select option
                        this._handleNotMultiSelect(jQuery(args.cellElement));
                        // Call the cell's method to toggle it's selected state
                        jQuery(args.cellElement).cell('toggleSelected');
                    }
                }
                if(this.options.autoOnOnRightClick) {
                    if((!jQuery(args.cellElement).cell('option', 'selected') || !this.options.preventOnIfSelected) &&
                       (!jQuery(args.cellElement).cell('option', 'disabled') || !this.options.preventOnIfDisabled) &&
                       (!jQuery(args.cellElement).cell('option', 'flipped') || !this.options.preventOnIfFlipped)) {
                        // Call the cell's method to toggle it's On state
                        jQuery(args.cellElement).cell('toggleOn');
                    }
                }
                if(this.options.autoDisableOnRightClick) {
                    if((jQuery(args.cellElement).cell('option', 'on') || !this.options.preventDisableIfNotOn) &&
                       (!jQuery(args.cellElement).cell('option', 'selected') || !this.options.preventDisableIfSelected) &&
                       (!jQuery(args.cellElement).cell('option', 'flipped') || !this.options.preventDisabledIfFlipped)) {
                        // Call the cell's method to toggle it's disabled state
                        jQuery(args.cellElement).cell('toggleDisabled');
                    }
                }
                if(this.options.autoFlipOnRightClick) {
                    if((jQuery(args.cellElement).cell('option', 'on') || !this.options.preventFlippedIfNotOn) &&
                       (!jQuery(args.cellElement).cell('option', 'disabled') || !this.options.preventFlippedIfDisabled) &&
                       (!jQuery(args.cellElement).cell('option', 'selected') || !this.options.preventFlippedIfSelected)) {
                        // Call the cell's method to toggle it's flipped state
                        jQuery(args.cellElement).cell('toggleFlipped');
                    }
                }
            }
            // If the GRID triggered event is a cellChangeSelectedState
            else if(this._cellEvents[e.type].gridEventName == 'cellChangeSelectedState') {
                // Call the method to handle the GRID multi-select option
                this._handleNotMultiSelect(jQuery(args.cellElement));
            }

            // Trigger the corresponding GRID event, extending the args values with the GRID element
			return (this._trigger(this._cellEvents[e.type].gridEventName, e, jQuery.extend(args, {gridElement: this.element})));
        },
        // events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
            // Re-enable selection and set class and content back to initial value
            this.element
                .enableSelection();
        },
        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply( arguments );
            this._refresh();
        },
        // _setOption is called for each individual option that is changing
        _setOption: function( key, value ) {
                // Keep a reference to object this
            var _self = this;
            
            // prevent invalid options
            // if the option is not an option of the widget
            if(!_self.options.hasOwnProperty(key)) {
                var obj = {};
                obj[key] = value;
                jQuery.throwNewError('Invalid Option', 'The provided option name is not an option of the cell widget.', obj);
                return;
            }
            // prevent invalid values
            if(/rowCount|columnCount/.test(key) && value < 0) {
                var obj = {};
                obj[key] = value;
                jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. Accepted values are: numeric value greater or equal to 0.', obj);
                return;
            }
            else if(/autoSizeCells|allowMultiSelect|autoSelectOnClick|autoDisableOnRightClick|autoFlipOnClick|flip/.test(key)) {
                if(value !== true && value !== false) {
                    var obj = {};
                    obj[key] = value;
                    jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. Accepted values are: true and false.', obj);
                    return;
                }
                switch(key) {
                    case 'allowMultiSelect':
                        if(!value) {
                            _self.cells().each(function(){
                                if(_self._cellEvents.cellchangeselectedstate.isListeningOn.indexOf(this) == -1) {
                                    jQuery(this).cell('option', 'changeSelectedState', jQuery.proxy(_self._handleEvents, _self));
                                    jQuery(this).cell('option', 'changedSelectedState', jQuery.proxy(_self._handleEvents, _self));
                                    _self._cellEvents.cellchangeselectedstate.isListeningOn.push(this);
                                    _self._cellEvents.cellchangedselectedstate.isListeningOn.push(this);
                                }
                            });
                        }
                        break;
                    case 'autoSelectOnClick':
//                        if(value) {
//                            _self.CELLS().each(function(){
//                                if(_self._cellEvents.cellclick.isListeningOn.indexOf(this) == -1) {
//                                    _self.CELLS().cell('option', 'click', jQuery.proxy(_self._handleEvents, _self));
//                                    _self._cellEvents.cellclick.isListeningOn.push(this);
//                                }
//                            });
//                        }
                        break;
                    case 'autoFlipOnClick':
//                        if(value) {
//                            _self.CELLS().each(function(){
//                                if(_self._cellEvents.cellchangeflippedstate.isListeningOn.indexOf(this) == -1) {
//                                    _self.CELLS().cell('option', 'click', jQuery.proxy(_self._handleEvents, _self));
//                                    _self._cellEvents.cellclick.isListeningOn.push(this);
//                                }
//                            });
//                        }
                        break;
                }
            }
            else if(/click|rightclick|dblclick|mousedown|mouseup|mouseover|mouseout|mouseenter|mouseleave|keydown|keypress|keyup/.test(key)) {
                if(value !== null && typeof value !== "function") {
                    var obj = {};
                    obj[key] = value;
                    jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. This option requires a function.', obj);
                    return;
                }
                _self.cells().each(function(){
                    if(_self._cellEvents['cell' + key].isListeningOn.indexOf(this) == -1) {
                        _self.cells().cell('option', key, value ? jQuery.proxy(_self._handleEvents, _self) : value);
                        _self._cellEvents['cell' + key].isListeningOn.push(this);
                    }
                });
            }
            else if(/cellChangeDisabledState|cellChangeSelectedState|cellChangedSelectedState|cellChangeOnState|cellChangeFlippedState|cellChangeValue|cellChangeColor|cellChangeBackgroundColor|cellChangeImage/.test(key)) {
                if(typeof value !== "function") {
                    var obj = {};
                    obj[key] = value;
                    jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. This option requires a function.', obj);
                    return;
                }
				var event = _self._cellEvents[key.toLowerCase()].gridEventName.charAt(4).toLowerCase() + _self._cellEvents[key.toLowerCase()].gridEventName.substring(5);

                _self.cells().each(function(){
                    if(_self._cellEvents[key.toLowerCase()].isListeningOn.indexOf(this) == -1) {
						

                        _self.cells().cell('option', event, value ? jQuery.proxy(_self._handleEvents, _self) : value);
                        _self._cellEvents[key.toLowerCase()].isListeningOn.push(this);

                        }
                });
            }
            _self._super( key, value );
        } 
    }); 
    // **********************************************************************************************************************************

    // **********************************************************************************************************************************
    // Cell Widget
    // **********************************************************************************************************************************
    jQuery.widget( "learningJQ.cell", {
        version: "1.1.0",
        // List of classes osed by the widget
        _classes: {
            main: 'learningJQ-cell',
            container: 'learningJQ-cell-container',
            face: 'cell-face front',
            back: 'cell-face back',
            adapter: 'learningJQ-cell-displayAdapter',
            image: 'learningJQ-cell-image',
            backgroundColor: 'learningJQ-cell-color'            
        },
        // **********************************************************************************************************************************
        // cell widget options:
        //      autoSize:       Is this cell auto-sized (if true, height will be set to match width).
        //                              true:   the CELLS will be sized using a percentage of the GRID width (100% / columnCount).
        //                              false:  fixed width and height must be assigned 
        //                                          (either with a class from cssClass option or learningJQ-cell class)
        //      displayType:    The display type for cell value.
        //                              one of DISPLAY_TYPES value. Will be used to decide
        //                              wich child to append to the cell for value display
        //      parentGrid:     The DOM element that has the GRID widget this cell is part of.
        //                          Set at initialization.
        //      disabled:       Is the cell disabled.
        //                          If disabled, it prevents all event from firing.
        //      address:        Is the object containing address info for the cell. The objects properties are:
        //                          index:      The zero-based index of this cell.
        //                                          Set at initialization.
        //                          row:        The zero-based row index of this cell.
        //                                          Set at initialization.
        //                          column:     The zero-based column index of this cell.
        //                                          Set at initialization.
        //      value:          The current value of this cell.
        //                          To modify this option use the value method.
        //      color:          The current background color of this cell. 
        //                          To modify this option use the color method.
        //      image:          Is the selection of the cell auto-fired on a click. 
        //                          To modify this option use the image method.
        //      selected:       Is the selection of the cell auto-fired on a click.
        //                          To modify this option use the select, unselect ans toggleSelect methods.
        //      on:             Is the selection of the cell auto-fired on a click.
        //                          To modify this option use the turnOn and turnOff methods.
        // **********************************************************************************************************************************
        options: {
            autoSize: false,
            makeCellSquare: false,
			useDisplayAdapters: true,
            displayType: 'text',
            backDisplayType: 'text',
            flip: false,
            parentGrid: null,
            address: {
                index: 0,
                row: 0,
                column: 0
            },
            value: '',
            color: '',
            backgroundColor: '',
            image: '',
            backValue: '',
            backBackgroundColor: '',
            backImage: '',
            selected: false,
            on: false,
            flipped: false,
			cellClassFromValuePrefix: '',
     
            // callbacks for widget events
            clear: null,
            change: null,
            changeDisabledState: null,
            changeSelectedState: null,
            changeOnState: null,
            changeFlippedState: null,
            changeValue: null,
            changeColor: null,
            changeBackgroundColor: null,
            changeImage: null,
            changeBackValue: null,
            changeBackBackgroundColor: null,
            changeBackImage: null,
			
            changedDisabledState: null,
            changedSelectedState: null,
            changedOnState: null,
            changedFlippedState: null,
            changedValue: null,
            changedColor: null,
            changedBackgroundColor: null,
            changedImage: null,
            changedBackValue: null,
            changedBackBackgroundColor: null,
            changedBackImage: null,
            
            // callbacks for mouse and keyboard events
            click: null,
            rightclick: null,
            dblclick: null,
            mousedown: null,
            mouseup: null,
            mouseover: null,
            mouseout: null,
            mouseenter: null,
            mouseleave: null,
            keydown: null,
            keypress: null,
            keyup: null
        },
        // the constructor
        _create: function() {
                // Keep a reference to this
            var _self = this,
                options = {};
            
            // cell child elements
            this._adapterElement = null;
            this._backgroundColorElement = null;
            this._imageElement = null;
            this._backAdapterElement = null;
            this._backBackgroundColorElement = null;
            this._backImageElement = null;
            this._isInitializing = true;
            
            // If the DOM element already has the learningJQ-cell class
            if(_self.element.hasClass(_self._classes.main)) {
                // Loop the data attributes of the DOM element
                jQuery.each(_self.element.data(), function(key, value) {
                    // If the data attribute matches the name of a cell widget option
                    if(_self.options.hasOwnProperty(key)) {
                        if(/row|column|index/.test(key)) {
                            // Make sure the address object exists in the options variable
                            options.address = options.address || {};
                            // Add the option to the address object of the options variable.
                            options.address[key] = value;
                        }
                        else {
                            // Add the option to the options variable.
                            options[key] = value;
                        }
                    }
                });
                // If the parent of the DOM element has the learningJQ-GRID class
                if(_self.element.parent().hasClass(jQuery.learningJQ.grid.prototype._classes.main)) {
                    // Add the parentGrid property to the option variable,
                    // using the DOM parent element as a value
                    options.parentGrid = _self.element.parent()[0];
                }
                // Disable the selection on the DOM element
                _self.element
                    // prevent double click to select test.html
                    .disableSelection();
            }
            else {
                _self.element
                    // add the cell Widget's class
                    .toggleClass( _self._classes.main, true )
                    // add the cell row and column classes
                    .toggleClass( 'row' + _self.options.address.row + ' col' + _self.options.address.column, true )
                    // prevent double click to select test.html
                    .disableSelection()
                    // empty the element
                    .empty();

                // If the parentGrid is null (the cell is not part of a GRID),
                // We set the index to the next index, row and column are set
                // to stay consistent with the conventions. Row will remain 0
                // and column will be set to the index value (as if the CELLS
                // were all on the same row).
                if(_self.options.parentGrid === null) {
                    var index = -1;                    
                    jQuery(_self.document)
                        // all the cell in the document
                        .find("." + _self._classes.cell)
                        // except the current one
                        .not(_self.element)
                        // that also have a parentGrid option value set to null
                        .filter(function(){
                            return jQuery(this).cell("option", "parentGrid") === null && jQuery(this).data().hasOwnProperty(_self._classes.cell);
                        })
                        // parse the collection to find the bigger index
                        .each(function(){
                            var idx = jQuery(this).cell("option", "index");
                            index = idx > index ? idx : index;
                        });                        
                    // Add one to the bigger index found
                    index++;
                    // Add the index and column options to the address object of the options variable
                    options.address = {
                        index: index,
                        column: index,
                        row: 0
                    };
                }
            }

            // Set all options gathered from the DOM object in the options variable
            this.option(options);
            
            var container = jQuery("<div>",{"class":_self._classes.container});
            this.element.after(container);
            this.element.appendTo(container);
            
            
            // Create 2 child elements, one for the face and one for the back 
            this._faceElement = jQuery("<div>",{"class":_self._classes.face});
            this._backElement = jQuery("<div>",{"class":_self._classes.back});

            this._backgroundColorElement = jQuery("<div>",{"class":_self._classes.backgroundColor});
            this._imageElement = jQuery("<div>",{"class":_self._classes.image});
            this._backBackgroundColorElement = jQuery("<div>",{"class":_self._classes.backgroundColor});
            this._backImageElement = jQuery("<div>",{"class":_self._classes.image});
			
			if(this.options.useDisplayAdapters) {
				this._adapterElement = jQuery("<div>",{"class":_self._classes.adapter});
				this._backAdapterElement = jQuery("<div>",{"class":_self._classes.adapter});
			}


            // Append the 3 child elements to the cell element
            this._faceElement
                    .append(this._backgroundColorElement)
                    .append(this._imageElement)
                    .append(this._adapterElement)
                    .appendTo(this.element);
            this._backElement
                    .append(this._backBackgroundColorElement)
                    .append(this._backImageElement)
                    .append(this._backAdapterElement)
                    .appendTo(this.element);
                
            // Initiate the Display Adapter Widgets
			if(this.options.useDisplayAdapters) {
				this._adapterElement.displayAdapter({type: _self.options.displayType, value: _self.options.value});
				this._backAdapterElement.displayAdapter({type: _self.options.backDisplayType, value: _self.options.backValue});
			}

            this._on(this.element,{cellflip:function(e){
                this._flip();
            }});
            
            options = {};
            jQuery.each(this.options, function(key, value) {
                if(value != null && /disabled|selected|on|clear|change|changeDisabledState|changeSelectedState|changedSelectedState|changeOnState|changeFlippedState|changeValue|changeColor|changeBackgroundColor|changeImage|changeBackValue|changeBackBackgroundColor|changeBackImage|click|rightclick|dblclick|mousedown|mouseup|mouseover|mouseout|mouseenter|mouseleave|keydown|keypress|keyup/.test(key)) {
                    options[key] = value;
                }
            });
            this._setOptions(options);

			if(_self.options['cellClassFromValuePrefix'] && _self.options['value']) {
				_self.element.addClass(_self.options['cellClassFromValuePrefix'] + _self.options['value']);
			}

            
            this._isInitializing = false;
            
            // Call the _refresh function
            _self._refresh();
        }, 
        // called when created, and later when changing options
        _refresh: function() {
                // Keep a reference to this
            var _self = this,
                // Get the parent GRID
                parentGrid = jQuery(_self.options.parentGrid),
                // Get the cell's GRID options
                gridOptions = parentGrid.length ? parentGrid.grid('option') : {};
            
            // If the cell is the first cell of it's row but not the first row, add the fonfr class. If not, remove it.
            // This class will break the line so the cell end up under the first one of the previous row
            _self.element.parent().toggleClass('fonfr', (_self.options.address.row > 0 && _self.options.address.column == 0));

            // If the element is set to be square (makeCellSquare option), add the
            // makeCellSquare class to the element, if not remove it.It will set the
            // css style to an ::after element to make the height the same as the width
            _self.element.toggleClass('makeCellSquare', _self.options.makeCellSquare);

            // If the cell option autoSize is set to true
            // Only possible if a parentGrid exists
            if(parentGrid.length && _self.options.autoSize) {
                // Set the with of the cell to 100% / the number of columns.
                _self.element.css({'width': (100.0 / gridOptions.columnCount) + '%', 'height': 'auto'});
            }
            
            if(this.options.flip && !this.options.click) {
                this.option('click', function(){});
            }

            // trigger a callback/event
            _self._trigger( "change", jQuery.Event(), {cellElement: _self.element, cellAddress: _self.options.address} );
        },
        // Clear the content of the cell but leave the selected and disabled state intact
        clear: function() {
            var options = {
                    color: this.options.color,
                    on: this.options.on,
                    value: this.options.value,
                    image: this.options.image,
                    backgroundColor: this.options.backgroundColor,
                    backValue: this.options.backValue,
                    backImage: this.options.backImage,
                    backBackgroundColor: this.options.backBackgroundColor
                };
            // trigger an event, check if it's canceled
            if ( this._trigger( "clear", jQuery.Event(), {cellElement: this.element, cellAddress: this.options.address, oldOptions: options} ) !== false ) {
                // remove the color
                this._setOption('color', '');
                // remove the value
                this._setOption('value', '');
                // remove the image
                this._setOption('image', '');
                // remove the background color
                this._setOption('backgroundColor', '');
                // remove the backValue
                this._setOption('backValue', '');
                // remove the backImage
                this._setOption('backImage', '');
                // remove the backBackground color
                this._setOption('backBackgroundColor', '');
                // turn off the cell
                this._setOption('on', false);
                // Reset the cell on it's front side
                this._setOption('flipped', false);
            }
            // return the cell widget
            return this;
        },
        // Toggle the disabled state of the cell or set it to the specified state (parameter disabled)
        toggleDisabled: function(disabled) {
            // return the result of the _setOption method, setting the disabled state either
            // to the value of the disabled parameter of the negation of the actual disabled value
            return this._setOption('disabled', disabled === undefined ? !this.options.disabled : disabled);
        },
        // Toggle the selected state of the cell or set it to the specified state (parameter selected)
        toggleSelected: function(selected) {
            // return the result of the _setOption method, setting the selected state either
            // to the value of the selected parameter of the negation of the actual selected value
            return this._setOption('selected', selected === undefined ? !this.options.selected : selected);
        },
        // Toggle the on state of the cell or set it to the specified state (parameter on)
        toggleOn: function(on) {
            // return the result of the _setOption method, setting the on state either
            // to the value of the on parameter of the negation of the actual on value
            return this._setOption('on', on === undefined ? !this.options.on : on);
        },
        // Toggle the flipped state of the cell or set it to the specified state (parameter flipped)
        toggleFlipped: function(flipped) {
            // return the result of the _setOption method, setting the on state either
            // to the value of the on parameter of the negation of the actual on value
            return this._setOption('flipped', flipped === undefined ? !this.options.flipped : flipped);
        },
        // Handle all the option value change for options having an impact on the
        // cell elements (disabled, selected, on, value, color, backgroundColor, image)
        // prop is the option to be modified and val is the new value to set for the option
        _propsMethod: function(prop, val) {
                // Keep a reference to this
            var _self = this,
                eventName,
                oldOptions = {},
                newOptions = {};
                
            // If a value has been provided
            if(val !== undefined) {
                // set the prop property of the newOptions object to either val or if the prop is image, create the proper value including the image path from the parentGrid if available
                newOptions[prop] = ((prop === 'image' || prop === 'backImage') && val !== '' && _self.options.parentGrid !== null ? (jQuery(_self.options.parentGrid).grid('option', 'imagePath') !== '' ? jQuery(_self.options.parentGrid).grid('option', 'imagePath') + '/' : '') + val : val);
                
                // We want to do this only if the value is changing. There is no need
                // to perform any of this if the new value is the same as tha actual one
                if(_self.options[prop] !== newOptions[prop] || _self._isInitializing) {
                    // generate the event name that will be triggered based on the property (parameter prop)
                    eventName = 'change' + prop.charAt(0).toUpperCase() + prop.substring(1) + (/on|selected|disabled|flipped/.test(prop) ? 'State' : '');
                    // set the actual value for the prop in the oldOptions object
                    oldOptions[prop] = _self.options[prop];

                    // Trigger an event, check if it's canceled
                    // The listener can prevent the action to be performed if the listening function returns false.
                    if(_self._trigger( eventName, jQuery.Event(), {cellElement: _self.element, cellAddress: _self.options.address, oldOptions: oldOptions, newOptions: newOptions}) !== false ) {
						// Depending on the property
                        switch(prop) {
                            case 'selected':
                                // trigger the blur to prevent focus from being on an input somewhere in the document
                                jQuery(document.activeElement).blur();
                            case 'on':
                            case 'flipped':
                            case 'disabled':
                                // Adjust the cell element's class
                                _self.element.toggleClass(prop, newOptions[prop]);
                                break;
                            case 'value':
                                // set the value option of the _adapterElement displayAdapter.
								if(_self.options['cellClassFromValuePrefix']) {
									var pattern = new RegExp(_self.options['cellClassFromValuePrefix'] + '\\S*'),
										tabClasses = _self.element.attr("class").match(pattern),
										curClass = (tabClasses && tabClasses.length ? tabClasses[0] : ''),
										newClass = _self.options['cellClassFromValuePrefix'] + newOptions[prop];
										
									_self.element.addClass(newClass).removeClass(curClass);
								}
								if(this.options.useDisplayAdapters) {
									_self._adapterElement.displayAdapter('option', 'value', newOptions[prop]);
								}
                                break;
                            case 'backValue':
                                // set the value option of the _adapterElement displayAdapter.
								if(this.options.useDisplayAdapters) {
									_self._backAdapterElement.displayAdapter('option', 'value', newOptions[prop]);
								}
                                break;
                            case 'color':
                                // Set the color of the cell element (adapter element will inherit the css style
                                _self._faceElement.css('color', newOptions[prop]);
                                break;
                            case 'backColor':
                                // Set the color of the cell element (adapter element will inherit the css style
                                _self._backElement.css('color', newOptions[prop]);
                                break;
                            case 'backgroundColor':
                                // Set the background color of the cell's _backgroundColorElement to the new background color value
                                _self._backgroundColorElement.css('background-color', newOptions[prop]);
                                break;
                            case 'backBackgroundColor':
                                // Set the background color of the cell's _backgroundColorElement to the new background color value
                                _self._backBackgroundColorElement.css('background-color', newOptions[prop]);
                                break;
                            case 'image':
                                // Set the image of the cell's _imageElement to the new image value
                                _self._imageElement.css('background-image', newOptions[prop] === '' ? '' : 'url(' + newOptions[prop] + ')');
                                break;
                            case 'backImage':
                                // Set the image of the cell's _imageElement to the new image value
                                _self._backImageElement.css('background-image', newOptions[prop] === '' ? '' : 'url(' + newOptions[prop] + ')');
                                break;
                        }
                    }
					else {
						return false;
					}
                }
            }
        },
        _flip: function() {
            // Re-enable selection and set class and content back to initial value
            this.element
                .toggleClass('flipped');
        },
        // events bound via _on are removed automatically
        // revert other modifications here
        _triggerEvent: function(e, eventProps, info) {
            if(!e) {
                e = jQuery.Event();
            }

            e = jQuery.extend(e, eventProps || {});
            e.toElement=this.element[0];
            info = jQuery.extend(info || {}, {cellElement:this.element, cellAddress:this.options.address});
            
            this._trigger(e.type, e, info);
        },
        // events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
            // Re-enable selection and set class and content back to initial value
            this.element
                .enableSelection();
        },
        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply( arguments );
            this._refresh();
        },
        // _setOption is called for each individual option that is changing
        _setOption: function( key, value ) {
		    var eventCompletedName = 'changed' + key.charAt(0).toUpperCase() + key.substring(1) + (/on|selected|disabled|flipped/.test(key) ? 'State' : '');
            // prevent invalid options
            // if the option is not an option of the widget
            if(!this.options.hasOwnProperty(key)) {
                var obj = {};
                obj[key] = value;
                jQuery.throwNewError('Invalid Option', 'The provided option name is not an option of the cell widget.', obj);
                return;
            }
            // prevent invalid values
            // if the key is one of the callbacks
            if(/clear|change|changeDisabledState|changeSelectedState|changedSelectedState|changeOnState|changeFlippedState|changeValue|changeColor|changeBackgroundColor|changeImage|changeBackValue|changeBackBackgroundColor|changeBackImage|click|rightclick|dblclick|mousedown|mouseup|mouseover|mouseout|mouseenter|mouseleave|keydown|keypress|keyup/.test(key)) {
				// if the value is not null and is not a function, throw an error
                if(value !== null && typeof value !== "function") {
                    var obj = {};
                    obj[key] = value;
                    jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. This option requires a function.', obj);
                    return false;
                }
                if(value !== null && this.options[key] !== value || this._isInitializing) {
                    // Depending on the key, add the corresponding listener on the cell
                    switch(key) {
                       case 'click':
//                            this._on(this.element,{click:function(e){e.toElement=this.element[0];this._trigger( e.type,e,{cellElement:this.element,cellAddress:this.options.address});}});
                            this._on(
                                this.element,
                                    {click:function(e){
                                        this._triggerEvent(e);
                                        if(this.options.flip && !e.handled)
                                        {
                                            this._triggerEvent(e, {type:'flip', handled:true}); 
                                        }
                                    }}
                            );
                            break;
                       case 'rightclick':
//                            this._on(this.element,{click:function(e){e.toElement=this.element[0];this._trigger( e.type,e,{cellElement:this.element,cellAddress:this.options.address});}});
                            this._on(
                                this.element,
                                    {contextmenu:function(e){
                                        this._triggerEvent(e, {type:'rightclick'});
                                        if(this.options.flip && !e.handled)
                                        {
                                            this._triggerEvent(e, {type:'flip', handled:true}); 
                                        }
                                        e.preventDefault();
                                    }
                                }
                            );
                            break;
                        case 'dblclick':
                            this._on(this.element,{dblclick:function(e){this._triggerEvent(e);}});
                            break;
                        case 'mousedown':
                            this._on(this.element,{mousedown:function(e){this._triggerEvent(e);}});
                            break;
                        case 'mouseup':
                            this._on(this.element,{mouseup:function(e){this._triggerEvent(e);}});
                            break;
                        case 'mouseover':
                            this._on(this.element,{mouseover:function(e){this._triggerEvent(e);}});
                            break;
                        case 'mouseout':
                            this._on(this.element,{mouseout:function(e){this._triggerEvent(e);}});
                            break;
                        case 'mouseenter':
                            this._on(this.element,{mouseenter:function(e){this._triggerEvent(e);}});
                            break;
                        case 'mouseleave':
                            this._on(this.element,{mouseleave:function(e){this._triggerEvent(e);}});
                            break;
                        case 'keydown':
                            this._on(jQuery('body'),{keydown:function(e){if(e.target == jQuery('body')[0]&&this.options.selected&&!e.handled){this._triggerEvent(e, {handled:true});}}});
                            break;
                        case 'keypress':
                            this._on(jQuery('body'),{keypress:function(e){if(e.target == jQuery('body')[0]&&this.options.selected&&!e.handled){this._triggerEvent(e, {handled:true});}}});
                            break;
                        case 'keyup':
                            this._on(jQuery('body'),{keyup:function(e){if(e.target == jQuery('body')[0]&&this.options.selected&&!e.handled){this._triggerEvent(e, {handled:true});}}});
                            break;
                    }
                }
                else {
                    return;
                }
            }
            // If the key is one of the boolean values
            else if(/autoSize|makeCellSquare|disabled|selected|on|flip|flipped/.test(key)) {
                // if the value is not true or false, throw an error
                if(value !== true && value !== false) {
                    var obj = {};
                    obj[key] = value;
                    jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. Accepted values are: true and false.', obj);
                    return false;
                }
                // If the key is either disabled, selected or on
                if(/disabled|selected|on|flipped/.test(key)) {
                    // Call the method to handle the change of value
                    if(this._propsMethod(key, value) === false){
						return;
					}
                }
            }
            // If the key is the dataType
            else if(key === 'displayType') {
				if(this.options.useDisplayAdapters) {
					// If the value is not an existing adapter, throw an error
					if(this._adapterElement.displayAdapter('option', 'adapters')[value] === undefined) {
						var obj = {};
						obj[key] = value;
						jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option.', obj);
						return false;
					}
					// Set the type option of the cell's displayAdapter to the new value
					this._adapterElement.displayAdapter('option', 'type', value);
				}
            }
            // If the key is the dataType
            else if(key === 'backDisplayType') {
				if(this.options.useDisplayAdapters) {
					// If the value is not an existing adapter, throw an error
					if(this._backAdapterElement.displayAdapter('option', 'adapters')[value] === undefined) {
						var obj = {};
						obj[key] = value;
						jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option.', obj);
						return false;
					}
					// Set the type option of the cell's displayAdapter to the new value
					this._backAdapterElement.displayAdapter('option', 'type', value);
				}
            }
            // If the option is the parentGrid and either the element is not found or is not an initialized GRID widget, throw an error
            else if(key === 'parentGrid' && (!jQuery(value).length || !jQuery(value).hasClass(jQuery.learningJQ.grid.prototype._classes.grid))) {
                var obj = {};
                obj[key] = value;
                jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. Accepted values are: true and false.', obj);
                return false;
            }
            // If the key is the cell's address
            else if(key === 'address') {
                // Get the number of cell elements (not counting this cell), that have the same parentGrid and the same row/column or the same index
                var nbIdent = jQuery(this.document)
                        // all the cell in the document
                        .find("." + this._classes.cell)
                        // except the current one
                        .not(this.element)
                        // that has the same parentGrid and either the same index or the same row/column
                        .filter(function(){
                            // get the cell'S options
                            var cellOptions = jQuery(this).data().hasOwnProperty(this._classes.cell) ? jQuery(this).cell("option") : {};
                            // return true if the parentGrid is the same and if either of row/column and index values are the same
                            return cellOptions.parentGrid == this.options.parentGrid && ((cellOptions.address.row === value.row && cellOptions.address.column === value.column) || cellOptions.address.index === value.index);
                        })
                        .length;
                // If the value is not an object or if there is at least another ell with same address of if one of the address info is either missong, not a number or less than 0, then trow an error
                if(typeof value !== "object" || nbIdent > 0 || value.row === undefined || isNaN(parseInt(value.row)) || value.row < 0 || value.column === undefined || isNaN(parseInt(value.column)) || value.column < 0 || value.index === undefined || isNaN(parseInt(value.index)) || value.index < 0) {
                    var obj = {};
                    obj[key] = value;
                    jQuery.throwNewError('Invalid Value', 'The provided value is not valid for this option. Accepted values are: true and false.', obj);
                    return false;
                }
            }
            // If the key is either the value, the color, the backgroundColor or the image
            else if(/value|color|backgroundColor|image|backValue|backBackgroundColor|backImage/.test(key)) {
                // Call the method to handle the change of value
				if(this._propsMethod(key, value) === false){
					return;
				}
            }
 
            this._super( key, value );
            
            this._triggerEvent(jQuery.Event(), {type:eventCompletedName},{oldOptions: {}, newOptions: {}});
        } 
    }); 
    // **********************************************************************************************************************************

    // **********************************************************************************************************************************
    // DisplayAdapter Widget used by each cell
    // **********************************************************************************************************************************
    jQuery.widget( "learningJQ.displayAdapter", {
        version: "1.1.0",
        // The classes used by the widget
        _classes: {
            main: 'learningJQ-displayAdapter'            
        },
        // Display Adapter options
        options: {
            // The type of adapter currently in use (Default to test.html)
            type: 'text',
            // The value to display (Default to empty string wich means no value)
            value: '',
            // The list of existing adapters (can be modified to add new adapters)
            adapters: {}
        },
        // the constructor
        _create: function() {
            // Keep track of current info (type and value) for change validation
            this._prev = {
                    type: '',
                    value: ''
                };
            // The chosen adapter
            this._adapter = null;

            this.options.adapters = jQuery.extend(this.options.adapters || {}, LearningJQ.basicAdapters);
            this.element
                // add the cell widget's class
                .toggleClass( this._classes.main, true )
                // prevent double click to select test.html
                .disableSelection()
                // empty the element
                .empty();
                
            // Set the adapter
            this._setAdapter(this.options.type);
        },
        // Set an adapter
        _setAdapter: function(type) {
            // If there is already an adapter
            if(this._adapter) {
                // Call the destroy method on the actual adapter if it exists
                this._adapter.destroy && this._adapter.destroy(this.element);
                // Remove the class of he actual adapter
                this.element.toggleClass(this._adapter.name, false);
            }
            // Set the new adapter
            this._adapter = this.options.adapters[type];
            // Call the create method of the new adapter if it exists
            this._adapter.create && this._adapter.create(this.element);
            // Add the class of the new adapter
            this.element.toggleClass(this._adapter.name, true);
            // Set the type info used to compare the actual option and the 
            // desired one to make sure to do this only when it has changed
            this._prev.type = type;
            // If the is a value set
            if(this.options.value)
                // Call the _setNewValue method
                this._setValue(this.options.value);
        },
        // Set the value and display it
        _setValue: function(value) {
            // If the adapter either does not have specific possible
            // elements or the value is part of the possible elements
            if(!(this._adapter.displayElements && !this._adapter.displayElements[value]) || value === '') {
                // Call the display method of the adapter if it exists
                this._adapter.display && this._adapter.display(this.element, value);
                // Set the value info used to compare the actual option and the 
                // desired one to make sure to do this only when it has changed
                this._prev.value = value;
            }
            // If the adapter could not display the value (empty values might not be displayable)
            // If the value is a value, remove it.
            else if(value !== '') {
                // As the adapter can't display the actual value, remove it
                this.option('value', '');
            }
        },
        // events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
            // Re-enable selection and set class and content back to initial value
            this.element
                // add the cell Widget's class
                .toggleClass( this._classes.main, false )
                .enableSelection();
        },
        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply( arguments );
        },
        // _setOption is called for each individual option that is changing
        _setOption: function( key, value ) {
            // if it is the type option
            if(key === 'type')
                // If the desired type is the same as the actual, return, else call the _setAdapter method
                if(value === this._prev.type) return false; else this._setAdapter(value);
            // if it is the value option
            if(key === 'value')
                // If the desired value is the same as the actual, return, else call the _setValue method
                if(value === this._prev.value) return false; else this._setValue(value);
                
            this._super( key, value );
        }
    });
    // **********************************************************************************************************************************

    // **********************************************************************************************************************************
    // Create the learningJQ namespace
    // **********************************************************************************************************************************
    var LearningJQ = LearningJQ || {};
    // **********************************************************************************************************************************
    // Add the Adapter class to the LearningJQ namespace
    // **********************************************************************************************************************************
    if(LearningJQ.Adapter === undefined) {
        LearningJQ.Adapter = function(name, create, display, destroy, displayUnitsCssClassSuffix, displayUnitsSelectorClassPrefix, displayElements) {
            // the name must be provided, if create, display or destroy is 
            // provided it must be a function and if there are displayElements,
            // displayUnitsCssClassSuffix and displayUnitsSelectorClassPrefix must be provided.
            if(name === undefined ||
               (create !== undefined &&
               typeof create !== "function") ||
               (display !== undefined &&
               typeof display !== "function") ||
               (destroy !== undefined &&
               typeof destroy !== "function") ||
               (displayElements && jQuery.map(displayElements, function(key, value) {return [value];}).length &&
                    (displayUnitsCssClassSuffix === undefined || displayUnitsSelectorClassPrefix === undefined))) {
                return;
            }
            // The name of the adapter
            this.name = name;
            // The function that creates the adapter
            this.create = create || null;
            // The function that displays the value in the adapter
            this.display = display || null;
            // The function that destroys the adapter
            this.destroy = destroy || null;
            // The prefix (first caracter) of the display units' selector class
            this.displayUnitsSelectorClassPrefix = displayUnitsSelectorClassPrefix || null;
            // An objects having as properties all the adapter's possible elements
            this.displayElements = displayElements || null;
            // The css class of the display units
            this.displayUnitsCssClass = jQuery.learningJQ.displayAdapter.prototype._classes.main + '-' + name + '-' + displayUnitsCssClassSuffix;
            // The css class of the display units container
            this.displayUnitsContainerCssClass = jQuery.learningJQ.displayAdapter.prototype._classes.main + '-' + name;
        };
    }
    // **********************************************************************************************************************************
    // Add the AdapterElement clss to the LearningJQ namespace
    // **********************************************************************************************************************************
    if(LearningJQ.AdapterElement === undefined) {
        LearningJQ.AdapterElement = function(code, unitsUsed) {
            // the element code and the bars/dots elements
            // needed to display this element must be provided.            
            if(code === undefined ||
               unitsUsed === undefined ||
               !unitsUsed instanceof Array) {
               return;
            }
            // Set the code
            this.code = code;
            // Set the required elements
            this.unitsUsed = unitsUsed;
        };
    }   
    // **********************************************************************************************************************************
    // Create the 4 basic display adapters and add them to the basicAdapters object property of the LearningJQ namespace
    //      none:       the value of the cell will not be displayed
    //      test.html:       the value of the cell will be injected as the html content of the display child element
    //      symbols:    the value of the cell will be displayed using the adapter 9x9 dot GRID. The allowed symbols are listed below
    //      digits:     the value of the cell will be displayed using the adapter 7 digital bars. The allowed digits are listed below
    // **********************************************************************************************************************************
    if(LearningJQ.basicAdapters === undefined) {
        LearningJQ.basicAdapters = {
            // The value of the cell will not be displayed
            none: new LearningJQ.Adapter('none'),
            // The value of the cell will be injected as the html content of the display child element
            text: new LearningJQ.Adapter(
                // name
                'text',
                // create function
                function(element) {
                    element.css({'width': '', 'height': '', 'margin-top': '', 'margin-left':''});
                },
                // display function
                function(element, value) {
                    element.html(value);
                },
                // destroy function
                function(element) {
                    element.empty();
                }
            ),
            // The value of the cell will be displayed using the adapter 9x9 dot GRID. The allowed symbols are listed below
            symbols: new LearningJQ.Adapter(
                // name
                'symbols',
                // create function
                function(element) {
                    var _width,
                        _size,
                        _margin,
                        _dotWidth,
                        _dotSize;
                        
                    // Calculate the with of the bars container based on the with of
                    // the cell element, leaving a 4 pixels gap around the bars container
                    _width = Math.floor((element.parent().width() - 8) / 9) * 9;
                    // Prepare the size value including the 'px'
                    _size = _width + 'px';
                    // Prepare the margin value, set to negative half of the width and add the 'px'
                    _margin = (_width / 2 * -1) + 'px';
                    _dotWidth = _width / 9 - 1;
                    _dotSize = _dotWidth + 'px';

                    // Loop the 9 rows of dots
                    for(var ld = 0; ld < 9; ld++)
                    {
                        // Loop the 9 columns of dots
                        for(var cd = 0; cd < 9; cd++)
                        {
                            // Append the dot to the dots container
                            jQuery("<div>", {
                                "class": this.displayUnitsContainerCssClass,
                                "style": "width:" + _dotSize + ";height:" + _dotSize + ";"
                            })
                            .append(jQuery("<div>", {
                                        "class": this.displayUnitsCssClass + " " + this.displayUnitsSelectorClassPrefix + ld + "" + cd + (cd === 8 ? ' lc' : '') + (ld === 8 ? ' lr' : '')
                                    })
                            )
                            .appendTo(element);
                        }
                    }
                    // Set the width, height, margin-top and margin-left css properties
                    element.css({'width': _size, 'height': _size, 'margin-top': _margin, 'margin-left':_margin});
                },
                // display function
                function(element, value) {
                    element
                        .find("." + this.displayUnitsCssClass)
                        .toggleClass("on", false)
                        .filter(this.displayElements[value] && this.displayElements[value].unitsUsed ? ("." + this.displayUnitsSelectorClassPrefix + this.displayElements[value].unitsUsed.join(', .' + this.displayUnitsSelectorClassPrefix)) : '')
                        .toggleClass('on', true);
                },
                // destroy function
                function(element) {
                    element.empty();
                },
                // displayUnitsCssClassSuffix
                'dot',
                // displayUnitsSelectorClassPrefix
                's',
                // displayElements
                {
                    // The property key is the value sent to the adapter
                    // For each key, create a new AdapterElement with the cssClass of the element and an array of display units to turn on
                    '0': new LearningJQ.AdapterElement('s0', [13, 14, 15, 22, 26, 32, 35, 36, 42, 44, 46, 52, 53, 56, 62, 66, 73, 74, 75]),
                    '1': new LearningJQ.AdapterElement('s1', [14, 23, 24, 34, 44, 54, 64, 73, 74, 75]),
                    '2': new LearningJQ.AdapterElement('s2', [13, 14, 15, 22, 26, 36, 45, 54, 63, 72, 73, 74, 75, 76]),
                    '3': new LearningJQ.AdapterElement('s3', [13, 14, 15, 22, 26, 36, 44, 45, 56, 62, 66, 73, 74, 75]),
                    '4': new LearningJQ.AdapterElement('s4', [15, 24, 25, 33, 35, 42, 45, 52, 53, 54, 55, 56, 65, 75]),
                    '5': new LearningJQ.AdapterElement('s5', [12, 13, 14, 15, 16, 22, 32, 33, 34, 35, 46, 56, 62, 66, 73, 74, 75]),
                    '6': new LearningJQ.AdapterElement('s6', [13, 14, 15, 22, 26, 32, 42, 43, 44, 45, 52, 56, 62, 66, 73, 74, 75]),
                    '7': new LearningJQ.AdapterElement('s7', [12, 13, 14, 15, 16, 26, 35, 44, 54, 64, 74]),
                    '8': new LearningJQ.AdapterElement('s8', [13, 14, 15, 22, 26, 32, 36, 43, 44, 45, 52, 56, 62, 66, 73, 74, 75]),
                    '9': new LearningJQ.AdapterElement('s9', [13, 14, 15, 22, 26, 32, 36, 43, 44, 45, 46, 56, 62, 66, 73, 74, 75]),
                    '-': new LearningJQ.AdapterElement('s-', [42, 43, 44, 45, 46]),
                    '!': new LearningJQ.AdapterElement('sEM', [14, 24, 34, 44, 54, 74]),
                    '#': new LearningJQ.AdapterElement('sPS', [13, 15, 23, 25, 32, 33, 34, 35, 36, 43, 45, 52, 53, 54, 55, 56, 63, 65, 73, 75]),
                    '$': new LearningJQ.AdapterElement('sDS', [14, 23, 24, 25, 26, 32, 43, 44, 45, 56, 62, 63, 64, 65, 74]),
                    '%': new LearningJQ.AdapterElement('sPct', [12, 13, 22, 23, 26, 35, 44, 53, 62, 65, 66, 75, 76]),
                    '&': new LearningJQ.AdapterElement('sEmp', [13, 22, 24, 32, 34, 43, 52, 54, 56, 62, 65, 73, 74, 76]),
                    '(': new LearningJQ.AdapterElement('sLP', [14, 23, 33, 43, 53, 63, 74]),
                    ')': new LearningJQ.AdapterElement('sRP', [14, 25, 35, 45, 55, 65, 74]),
                    '*': new LearningJQ.AdapterElement('sStar', [22, 24, 26, 33, 34, 35, 42, 43, 45, 46, 53, 54, 55, 62, 64, 66]),
                    '/': new LearningJQ.AdapterElement('sSl', [26, 35, 44, 53, 62]),
                    '?': new LearningJQ.AdapterElement('sQM', [13, 14, 15, 22, 26, 36, 44, 45, 54, 74]),
                    '@': new LearningJQ.AdapterElement('sAS', [13, 14, 15, 22, 26, 32, 35, 36, 42, 44, 46, 52, 55, 56, 62, 73, 74, 75, 76]),
                    '\\': new LearningJQ.AdapterElement('sBS', [22, 33, 44, 55, 66]),
                    '+': new LearningJQ.AdapterElement('sPlus', [24, 34, 42, 43, 44, 45, 46, 54, 64]),
                    '<': new LearningJQ.AdapterElement('sLt', [25, 34, 43, 54, 65]),
                    '=': new LearningJQ.AdapterElement('sEq', [32, 33, 34, 35, 36, 52, 53, 54, 55, 56]),
                    '>': new LearningJQ.AdapterElement('sGt', [23, 34, 45, 54, 63]),
                    'A': new LearningJQ.AdapterElement('sA', [13, 14, 15, 22, 26, 32, 36, 42, 46, 52, 53, 54, 55, 56, 62, 66, 72, 76]),
                    'B': new LearningJQ.AdapterElement('sB', [12, 13, 14, 15, 22, 26, 32, 36, 42, 43, 44, 45, 52, 56, 62, 66, 72, 73, 74, 75]),
                    'C': new LearningJQ.AdapterElement('sC', [13, 14, 15, 22, 26, 32, 42, 52, 62, 66, 73, 74, 75]),
                    'D': new LearningJQ.AdapterElement('sD', [12, 13, 14, 15, 22, 26, 32, 36, 42, 46, 52, 56, 62, 66, 72, 73, 74, 75]),
                    'E': new LearningJQ.AdapterElement('sE', [12, 13, 14, 15, 16, 22, 32, 42, 43, 44, 45, 52, 62, 72, 73, 74, 75, 76]),
                    'F': new LearningJQ.AdapterElement('sF', [12, 13, 14, 15, 16, 22, 32, 42, 43, 44, 45, 52, 62, 72]),
                    'G': new LearningJQ.AdapterElement('sG', [13, 14, 15, 22, 26, 32, 42, 44, 45, 46, 52, 56, 62, 66, 73, 74, 75]),
                    'H': new LearningJQ.AdapterElement('sH', [12, 16, 22, 26, 32, 36, 42, 43, 44, 45, 46, 52, 56, 62, 66, 72, 76]),
                    'I': new LearningJQ.AdapterElement('sI', [13, 14, 15, 24, 34, 44, 54, 64, 73, 74, 75]),
                    'J': new LearningJQ.AdapterElement('sJ', [16, 26, 36, 46, 56, 62, 66, 73, 74, 75]),
                    'K': new LearningJQ.AdapterElement('sK', [12, 16, 22, 26, 32, 35, 42, 43, 44, 52, 55, 62, 66, 72, 76]),
                    'L': new LearningJQ.AdapterElement('sL', [12, 22, 32, 42, 52, 62, 72, 73, 74, 75, 76]),
                    'M': new LearningJQ.AdapterElement('sM', [12, 16, 22, 23, 25, 26, 32, 34, 36, 42, 46, 52, 56, 62, 66, 72, 76]),
                    'N': new LearningJQ.AdapterElement('sN', [12, 16, 22, 26, 32, 33, 36, 42, 44, 46, 52, 55, 56, 62, 66, 72, 76]),
                    'O': new LearningJQ.AdapterElement('sO', [13, 14, 15, 22, 26, 32, 36, 42, 46, 52, 56, 62, 66, 73, 74, 75]),
                    'P': new LearningJQ.AdapterElement('sP', [12, 13, 14, 15, 22, 26, 32, 36, 42, 43, 44, 45, 52, 62, 72]),
                    'Q': new LearningJQ.AdapterElement('sQ', [13, 14, 15, 22, 26, 32, 36, 42, 46, 52, 56, 62, 65, 66, 73, 74, 75, 76]),
                    'R': new LearningJQ.AdapterElement('sR', [12, 13, 14, 15, 22, 26, 32, 36, 42, 43, 44, 45, 52, 54, 62, 65, 72, 76]),
                    'S': new LearningJQ.AdapterElement('sS', [13, 14, 15, 22, 26, 32, 43, 44, 45, 56, 62, 66, 73, 74, 75]),
                    'T': new LearningJQ.AdapterElement('sT', [12, 13, 14, 15, 16, 24, 34, 44, 54, 64, 74]),
                    'U': new LearningJQ.AdapterElement('sU', [12, 16, 22, 26, 32, 36, 42, 46, 52, 56, 62, 66, 73, 74, 75]),
                    'V': new LearningJQ.AdapterElement('sV', [12, 16, 22, 26, 32, 36, 42, 46, 52, 56, 63, 65, 74]),
                    'W': new LearningJQ.AdapterElement('sW', [12, 16, 22, 26, 32, 36, 42, 46, 52, 54, 56, 62, 63, 65, 66, 72, 76]),
                    'X': new LearningJQ.AdapterElement('sX', [12, 16, 22, 26, 33, 35, 44, 53, 55, 62, 66, 72, 76]),
                    'Y': new LearningJQ.AdapterElement('sY', [12, 16, 22, 26, 33, 35, 44, 54, 64, 74]),
                    'Z': new LearningJQ.AdapterElement('sZ', [12, 13, 14, 15, 16, 26, 35, 44, 53, 62, 72, 73, 74, 75, 76])
                }
            ),
            // The value of the cell will be displayed using the adapter 7 digital bars. The allowed digits are listed below
            digits: new LearningJQ.Adapter(
                // name
                'digits',
                // create function
                function(element) {
                    var _width,
                        _size,
                        _margin;
                    
                        // Calculate the with of the bars container based on the with of
                        // the cell element, leaving a 4 pixels gap around the bars container
                        _width = element.parent().width() - 8;
                        // Prepare the size value including the 'px'
                        _size = _width + 'px';
                        // Prepare the margin value, set to negative half of the width and add the 'px'
                        _margin = (_width / 2 * -1) + 'px';

                        // Loop the 7 bars
                        for(var _b = 1; _b <= 7; _b++)
                        {
                            // Append the bar to the bars container
                            jQuery("<div>", {
                                "class": this.displayUnitsCssClass + " " + this.displayUnitsSelectorClassPrefix + _b
                            })
                            .appendTo(element);
                        }
                        // Set the width, height, margin-top and margin-left css properties
                        element.css({'width': _size, 'height': _size, 'margin-top': _margin, 'margin-left':_margin});
                },
                // display function
                function(element, value) {
                    element
                        .children("." + this.displayUnitsCssClass)
                        .toggleClass("on", false)
                        .filter(this.displayElements[value] && this.displayElements[value].unitsUsed ? ("." + this.displayUnitsSelectorClassPrefix + this.displayElements[value].unitsUsed.join(', .' + this.displayUnitsSelectorClassPrefix)) : '')
                        .toggleClass('on', true);
                },
                // destroy function
                function(element) {
                    element.empty();
                },
                // displayUnitsCssClassSuffix
                'bar',
                // displayUnitsSelectorClassPrefix
                'd',
                // displayElements
                {
                    // The property key is the value sent to the adapter
                    // For each key, create a new AdapterElement with the cssClass of the element and an array of display units to turn on
                    '0': new LearningJQ.AdapterElement('d0', [1,3,4,5,6,7]),
                    '1': new LearningJQ.AdapterElement('d1', [5,7]),
                    '2': new LearningJQ.AdapterElement('d2', [1,2,3,5,6]),
                    '3': new LearningJQ.AdapterElement('d3', [1,2,3,5,7]),
                    '4': new LearningJQ.AdapterElement('d4', [2,4,5,7]),
                    '5': new LearningJQ.AdapterElement('d5', [1,2,3,4,7]),
                    '6': new LearningJQ.AdapterElement('d6', [1,2,3,4,6,7]),
                    '7': new LearningJQ.AdapterElement('d7', [1,5,7]),
                    '8': new LearningJQ.AdapterElement('d8', [1,2,3,4,5,6,7]),
                    '9': new LearningJQ.AdapterElement('d9', [1,2,3,4,5,7]),
                    '-': new LearningJQ.AdapterElement('d-', [2])
                }
            )
        }
    };
    // **********************************************************************************************************************************   

    jQuery('.' + jQuery.learningJQ.grid.prototype._classes.main)
        .filter(function() {
            return  !jQuery(this).data().hasOwnProperty(jQuery.learningJQ.grid.prototype._classes.main);
        })
        .grid();
        
    jQuery('.' + jQuery.learningJQ.cell.prototype._classes.main)
        .filter(function() {
            return  !jQuery(this).data().hasOwnProperty(jQuery.learningJQ.cell.prototype._classes.main);
        })
        .cell();        
});