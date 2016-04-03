var test = require('tape-catch');
var Remath = require('..').default;

test('cell._dependsOn works', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {formula: 'a + 15'});

  t.equal(b._dependsOn('a'), true);
  t.equal(b._dependsOn('gamma'), false);

  t.end();
});

test('Can remove a dependent', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {formula: 'a + 15'});

  b._removeDependent('a');

  t.equal(b._dependsOn('a'), false);
  t.equal(b.value(), 'error');

  t.end();
});

test('Can remove a dependent with sheet.removeCell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {formula: 'a + 15'});

  sheet.removeCell('a');

  // Now we removed a from the sheet
  // So, b's value should be error and the user will need to change the formula
  t.equal(b.value(), 'error');

  t.end();
});

test('Autorun is triggered on the value of a dependent when a dependent is removed', (t) => {
  var sheet = new Remath();
  var called = 0;

  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {formula: 'a + 15'});

  sheet.autorun(() => {
    b.value();
    called++;
  });

  sheet.removeCell('a');

  // Now we removed a from the sheet
  // So, b's value should be error and the autorun function should run
  // because b's value depended on a's
  t.equal(b.value(), 'error');

  t.equal(called, 2);
  t.end();

});
