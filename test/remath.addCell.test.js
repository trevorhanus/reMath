// var test = require('tape-catch');
// var Remath = require('..').default;
//
// /**
//  * Remath.addCell Method
//  */
//
// test('Adds a Cell', (t) => {
//
//   var sheet = new Remath();
//
//   var c = sheet.addCell('c');
//
//   t.deepEqual(sheet.find('c'), c);
//
//   t.end();
// });
//
// test('Calls alert callbacks when trying to add formula without a symbol', (t) => {
//
//   var sheet = new Remath();
//
//   var c = sheet.addCell();
//
//   t.equal(sheet.alerts[0].type, 'error');
//
//   t.end();
// });
//
// test('Calls alert callbacks when trying to add with a symbol that is not a string', (t) => {
//
//   var sheet = new Remath();
//
//   var c = sheet.addCell(9);
//
//   t.equal(sheet.alerts[0].type, 'error');
//   t.equal(sheet.find(9), null);
//
//   t.end();
// });
//
// test('Calls alert callbacks when trying to add with a symbol with a space or a leading number', (t) => {
//
//   var sheet = new Remath();
//
//   var c = sheet.addCell(9);
//
//   t.equal(sheet.alerts[0].type, 'error');
//   t.equal(sheet.find(9), null);
//
//   t.end();
// });
//
// test('Adds a cell with the correct formula', (t) => {
//
//   var sheet = new Remath();
//
//   var c = sheet.addCell('c', {x: 150, y: 150, formula: '10 + 50'});
//
//   t.equal(c.value, 60);
//   t.equal(c.x, 150);
//
//   t.end();
// });
