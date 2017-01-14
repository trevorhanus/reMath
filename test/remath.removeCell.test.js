var test = require('tape-catch');
var Remath = require('..').default;

test('Can remove an independent cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');
  // Remove a
  sheet.removeCell('a');

  t.equal(sheet.cells.length, 0);

  t.end();
});

test('Can remove a dependent cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {formula: 'a + 5'});

  // Remove b
  sheet.removeCell('a');

  t.equal(b._dependents.get('a'), undefined);
  t.equal(b.value(), 'error');

  t.end();
});

test('Can remove a cell when there are booleans and text cells', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {formula: 'a + 5'});
  var c = sheet.addCell('c', {type: 'boolean', val: true});
  var d = sheet.addCell('d', {type: 'text', content: 'Testing text cell'});

  // Remove b
  sheet.removeCell('a');

  t.equal(b._dependents.get('a'), undefined);
  t.equal(b.value(), 'error');

  t.end();
});
