// var test = require('tape-catch');
// var Calc = require('..').default;
//
// /**
//  * Formula
//  */
//
// test('Can change the formula', (t) => {
//
//   var calc = new Calc();
//
//   var c = calc.addFormula('c');
//
//   c.setFormula('10 + 40');
//
//   t.equal(c.value, 50);
//
//   t.end();
// });
//
// test('Can change the formula of an added formula', (t) => {
//
//   var calc = new Calc();
//   var a = calc.addInput('a');
//   a.value = 10;
//
//   var c = calc.addFormula('c');
//   c.setFormula('a + 40');
//
//   var d = calc.addFormula('d');
//   d.setFormula('a + c');
//
//   t.equal(d.value, 60);
//
//   d.setFormula('c + 10');
//   t.equal(d.value, 60);
//
//   t.end();
// });
