var test = require('tape-catch');
var Remath = require('..').default;

/**
 * Autorun
 */

test('Runs an autorun when input value is updated', (t) => {

  var sheet = new Remath();
  var a = sheet.addCell('a');
  var called = 0;

  sheet.autorun(() => {
    called++;
    a.value();
  });

  a.setFormula('10');

  t.equal(called, 2);
  t.end();
});

test('Updates a formula when a dependent changes value', (t) => {

  var sheet = new Remath();
  var a = sheet.addCell('a', {formula: '0'});
  var b = sheet.addCell('b', {formula: 'a + 10'});
  var called = 0;

  sheet.autorun(() => {
    called++;
    b.value();
  });

  a.setFormula('10');

  t.equal(called, 2);
  t.end();
});

test('Updates nested dependents', (t) => {

  var sheet = new Remath();
  var a = sheet.addCell('a', {formula: '0'});
  var b = sheet.addCell('b', {formula: 'a + 10'});
  var c = sheet.addCell('c', {formula: 'b + 10'});

  var called = 0;
  sheet.autorun(() => {
    called++;
    c.value();
  });

  a.setFormula('10');

  t.equal(called, 2);
  t.end();
});

// test('Updates a formula when a dependent changes value', (t) => {
//
//   var calc = new Calc();
//   var a = calc.addInput('a');
//   var b = calc.addFormula('b', {formula: 'a + 10'});
//
//   var numberOfRuns = 0;
//   mobx.autorun(() => {
//     numberOfRuns++;
//     if (numberOfRuns === 2) {
//       t.equal(b.value, 20);
//       t.end();
//     } else {
//       var value = b.value;
//     }
//   })
//
//   a.value = 10;
// });

// test('Can depend formulas on formulas', (t) => {
//
//   var calc = new Calc();
//   var a = calc.addInput('a');
//   var b = calc.addFormula('b', {formula: 'a + 10'});
//   var c = calc.addFormula('c', {formula: 'b + 10'});
//
//   var numberOfRuns = 0;
//   mobx.autorun(() => {
//     numberOfRuns++;
//     if (numberOfRuns === 2) {
//       t.equal(c.value, 30);
//       t.end();
//     } else {
//       var value = c.value;
//     }
//   })
//
//   a.value = 10;
// });
//
// test('Autoruns when a new Input is added', (t) => {
//
//   var calc = new Calc();
//
//   var numberOfRuns = 0;
//   mobx.autorun(() => {
//     numberOfRuns++;
//     if (numberOfRuns === 2) {
//       t.equal(calc.find('a').symbol, 'a');
//       t.end();
//     } else {
//       var inputs = calc.inputs.length;
//     }
//   });
//
//   var a = calc.addInput('a');
// });
