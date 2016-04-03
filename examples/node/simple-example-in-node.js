var Remath = require('..').default;

var sheet = new Remath();

// Add a cell to the sheet
var a = sheet.addCell('a');

// Set the formula
a.setFormula('10');

// This anonymous function will run once, immediately, then any time the value of 'a' changes
sheet.autorun(() => {
  console.log('The value of a = ', a.value());
});
// => The value of a = 10

a.setFormula('5');
// => The value of a = 5

// Let's add another cell to the sheet, this one will be dependent on the value of 'a'
var b = sheet.addCell('b', {formula: 'a + 5'});

sheet.autorun(() => {
  console.log('The value of b = ', b.value());
  // => The value of b = 10
})

a.setFormula('10');
// => The value of a = 10
// => The value of b = 15
// The autorun function is called again, because the value of b depends on the value of a.
