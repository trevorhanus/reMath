var test = require('tape-catch');
var Remath = require('..').default;

/**
 * Cell.setFormula Method
 */

test('Alerts when creating a circular reference', (t) => {

  var sheet = new Remath();
  var called = 0;
  sheet.onAlert(() => {
    called++;
  });

  var a = sheet.addCell('a');
  var b = sheet.addCell('b');
  var c = sheet.addCell('c');

  // TODO: finish test

  t.end();
});

test('sets formula to 0, when empty string is passed', (t) => {

  var sheet = new Remath();

  var a = sheet.addCell('a');
  a.setFormula('');

  t.equal(a.value(), 0);

  t.end();
});
