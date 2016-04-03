// Need the ability to update a cells symbol

var test = require('tape-catch');
var Remath = require('..').default;

/**
 * Remath.addCell Method
 */

test('Can update a cells symbol', (t) => {

  var sheet = new Remath();

  var alpha = sheet.addCell('temp1');

  alpha.updateSymbol('alpha');

  t.equal(sheet.find('alpha'), alpha);
  t.equal(sheet.find('temp1'), null);

  t.end();
});

test('Can update a cells symbol for nest cells', (t) => {

  var sheet = new Remath();

  var temp1 = sheet.addCell('temp1', {formula: '10'});
  var b = sheet.addCell('b', {formula: 'temp1 + 10'});

  t.equal(b.value(), 20);

  temp1.updateSymbol('a');

  t.equal(temp1.value(), 10);
  t.equal(sheet.find('temp1'), null);
  t.equal(b.value(), 20);

  t.end();
});

test('Calls alerts when trying to update with an invalid symbol', (t) => {

  var sheet = new Remath();
  var called = 0;
  sheet.onAlert(() => {
    called++;
  });

  var temp1 = sheet.addCell('temp1', {formula: '10'});
  var b = sheet.addCell('b', {formula: 'temp1 + 10'});

  t.equal(b.value(), 20);

  temp1.updateSymbol('1');

  t.equal(sheet.find('temp1'), temp1);
  t.equal(sheet.find('1'), null);
  t.equal(called, 1);

  t.end();
});