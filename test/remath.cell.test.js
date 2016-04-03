var test = require('tape-catch');
var Remath = require('..').default;

/**
 * Formula
 */

test('Can change the formula', (t) => {

  var sheet = new Remath();

  var c = sheet.addCell('c');

  c.setFormula('10 + 40');

  t.equal(c.value(), 50);

  t.end();
});

test('Can change the formula of an added formula', (t) => {

  var sheet = new Remath();
  var a = sheet.addCell('a');
  a.setFormula('10');

  var c = sheet.addCell('c');
  c.setFormula('a + 40');

  var d = sheet.addCell('d');
  d.setFormula('a + c');

  t.equal(d.value(), 60);

  d.setFormula('c + 10');
  t.equal(d.value(), 60);

  t.end();
});
