# Remath

A reactive spreadsheet-like math library.

Uses mobx for reactivity, Numeral.js to format values, and mathjs to parse and evaluate the math.

## Example Usage

```javascript

import Remath from 'remath';

var sheet = new Remath();

// Add a cell to the sheet
var a = sheet.addCell('a');

// Set the formula
a.setFormula('10');

// This anonymous function will run once, immediately, then any time the value of 'a' changes
sheet.autorun(() => {
  console.log('The value of a = ', a.value);
});

a.setFormula('5');
// => The value of a = 5

// Let's add another cell to the sheet, this one will be dependent on the value of 'a'
sheet.addCell('b', {formula: 'a + 5'});

sheet.autorun(() => {
  console.log('The value of b = ', b.value);
  // => The value of b = 10
})

a.setFormula('10');
// => The value of b = 15
// The autorun function is called again, because the value of b depends on the value of a.

```

## API

#### Instantiation

var sheet = new Remath();

#### .onAlert( callback({type: 'type of error', message: 'error message'}) )

Registers a function to be called when the end user inputs data incorrectly.

eg: The user enters an invalid formula. Or the user enters a symbol that starts with a number.

The callbacks are called with an object with `type` and `message` keys.

#### .addCell(symbol: String, options: Object)

sheet.addCell('gamma')

Adds a cell to the sheet. `symbol` is required, must be unique, can't have spaces, and can't start with a number

The onAlert callbacks will be called when there is an error.

`options` object is optional.

symbol: String
options: CellOptions

CellOptions {
  name: String
  formula: String
  displayFormat: String => any string that works with numeral.js
}

#### .removeCell(symbol)

sheet.removeCell('alpha')

Removes a cell from the sheet.

#### .find(symbol)

sheet.find('gamma')

Returns the cell if it can be found. Calls the onAlert callbacks if the symbol or id can't be found

# Cell

## Public API

#### Instantiation

var cell = new Cell(symbol: String, parentClass: Remath, options: Object);

#### .displayFormat

A string that works with the numeral.js api. Determines what the .displayValue() method will return. Can be updated by simply assigning it. This will trigger reactions.

```javascript
cell.displayValue = '+0,0'
```

For example.

```javascript
cell.displayFormat = '$0,0.00';
cell.setFormula('100000');
cell.displayValue()
// returns '$100,000.00'
```

#### .isDependent()

Returns a bool. True if this cell is dependent on other cells. False if not.

#### .displayValue()

Returns a string that represents the cells value ported through numeral.js

#### .setFormula()

Sets the formula. Takes a string that can reference any other symbols in the sheet. Will call the alert callbacks if the formula references a symbol that doesn't exist or is of a wrong type, and will not set the new formula.

#### .updateSymbol(symbol)

Updates the cells symbol and traverses the entire sheet to find references to the cell and changes the symbol there as well.

## Private API

#### ._dependents is an Object{String: Cell}

This is an object that holds the dependencies for a cell. It is replaced every time the formula is set.

#### ._removeAllDependents()

Removes all the dependencies on other cells. This should only be called when a new formula is being set that has no dependencies

#### ._addDependency(symbol: String)

Adds a dependency to another cell, if that symbol can be found and is not already a dependency

#### ._scope()

Returns an object with keys as symbols and values as the cells current value. used to pass into the mathjs eval method

## Error Handling

The remath library assumes it is accepting input from end users. End users can input formulas, symbols, names, etc. In general, any exception that is caused by an end user will be caught and any callbacks registered by the Remath.onAlert method will be called. On the other hand, if the library is implemented incorrectly by the developer, the exception will not be caught.

A general rule of thumb is that an error in any public method will call the alert callbacks, and private methods will throw errors. This allows the public methods to catch the errors before they escape the library.

## Running locally

clone the repo

`git clone https://github.com/trevorhanus/remath`

install node modules

`npm install`

run the tests

`npm run test`
