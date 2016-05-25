var test = require('tape-catch');
var Remath = require('..').default;
var Cell = require('../lib/Cell').default;

test('Can instantiate a Cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a');

  t.equal(a.symbol, 'a');

  t.end();
});

test('Does not create cell when there is an error', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('1a');

  t.equal(null, a);
  t.end();

});

test('Can instantiate with proper options', (t) => {
  var sheet = new Remath();
  var options = {
    name: 'Trevor',
    formula: '10 + 40',
    displayFormat: '0,0'
  };

  var a = sheet.addCell('a', options);

  t.equal(a.symbol, 'a');
  t.equal(a.name, 'Trevor');
  t.equal(a.formula, '10 + 40');
  t.equal(a.displayFormat, '0,0');

  t.end();
});

test('Alerts when trying to add a cell with symbol that starts with number', (t) => {
  var sheet = new Remath();
  var called = 0;

  sheet.onAlert(function(alert) {
    called++;
  });

  var a = sheet.addCell('1a');

  setTimeout(function () {
    t.equal(called, 1);
    t.end();
  });

});

test('Calls alerts when trying to add formula without a symbol', (t) => {

  var sheet = new Remath();

  var called = 0;
  sheet.onAlert(() => {
    called++;
  });

  sheet.addCell();

  t.equals(called, 1);

  t.end();
});


test('Alerts when trying to add a cell with name that is not a string', (t) => {
  var sheet = new Remath();
  var called = 0;

  sheet.onAlert(function(alert) {
    t.equal(alert.message, 'cell name must be a string');
    called++;
  });

  var a = sheet.addCell('trevor', {name: 1});

  setTimeout(function () {
    t.equal(called, 1);
    t.end();
  });

});

test('Alerts when trying to add a cell with symbol with space', (t) => {
  var sheet = new Remath();
  var called = 0;

  sheet.onAlert(function(alert) {
    called++;
  });

  var a = sheet.addCell('trevo r');

  setTimeout(function () {
    t.equal(called, 1);
    t.end();
  });

});

test('Throws when trying to create cell without a parent', (t) => {

  t.throws(function () { var cell = new Cell('a') });
  t.end();

});

test('Can set the formula', (t) => {

  var sheet = new Remath();

  sheet.onAlert(function (alert) {
    throw alert.message;
  });

  var a = sheet.addCell('a');
  var b = sheet.addCell('b');
  a.setFormula('10 + 50');

  t.equal(a.formula, '10 + 50');
  t.equal(a.value(), 60);

  b.setFormula('50');
  a.setFormula('b + 20');

  t.equal(a.value(), 70);

  t.end();

});

test('Knows when a cell is dependent', (t) => {

  var sheet = new Remath();
  var options = {
    name: 'Trevor',
    formula: '10',
    displayFormat: '0,0'
  };

  var a = sheet.addCell('a', options);
  var b = sheet.addCell('b', options);

  t.equal(a.isDependent(), false);

  a.setFormula('b + 10');

  t.equal(a.isDependent(), true);

  t.end();

});

test('Alerts when trying to set a formula with a symbol that does not exist', (t) => {

  var sheet = new Remath();
  var called = 0;

  sheet.onAlert(function(alert) {
    called++;
  });

  var a = sheet.addCell('a');
  a.setFormula('b + 10');

  t.equal(called, 1);

  t.end();

});

test('Does not change formula when formula is invalid', (t) => {

  var sheet = new Remath();

  var a = sheet.addCell('a');
  // This is an invalid formula
  a.setFormula('b + 10');

  t.equal('', a.formula);
  t.equal(a.isDependent(), false);

  t.end();

});

test('Does not allow duplicate symbols', (t) => {

  var sheet = new Remath();
  var called = 0;

  sheet.onAlert(function(alert) {
    called++;
  });

  var a = sheet.addCell('a');
  var aAgain = sheet.addCell('a');

  t.equal(called, 1);
  t.equal(aAgain, null);

  t.end();

});

test('Can set a reactive custom property on Cell', (t) => {

  var sheet = new Remath();
  var called = 0;

  var a = sheet.addCell('a');
  a.customProps.set('foo', 'bar');

  sheet.autorun(function() {
    called++;
    a.customProps.get('foo');
  });

  a.customProps.set('foo', 'bar2');

  t.equal(called, 2);

  t.end();

});
