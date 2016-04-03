var Remath = require('..').default;

var sheet = new Remath();

sheet.onAlert((alert) => {
  console.log(alert.message);
});

// Add a cell to the sheet
var a = sheet.addCell('a');

// Set the formula
a.setFormula('10');

// Add b which is dependent on the value of 'a'
var b = sheet.addCell('b', {formula: 'a + 5'});

// Log any time the value of 'b' changes
sheet.autorun(() => {
  console.log('The value of b = ', b.getValue());
});

// Remove a
sheet.removeCell('a');
// The autorun function is called again, because the value of b depends on the value of a.
