var test = require('tape-catch');
var Remath = require('..').default;
var BooleanCell = require('../lib/BooleanCell').default;

test('instaniates', (t) => {
  var remath = new Remath();
  var bool = new BooleanCell('bool', remath, {val: true});
  t.equal(bool.value(), true);
  t.end();
});

test('Can create a boolean cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'boolean', val: true});
  t.equal(a.value(), true);
  t.end();
});

test('Can change the val of a boolean cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'boolean', val: true});
  a.val = false;
  t.equal(a.value(), false);
  t.end();
});

test('Not able to add cell with same symbol', (t) => {
  var sheet = new Remath();
  var b = sheet.addCell('b');
  var called = 0;
  sheet.onAlert(() => {
    called++;
  });

  var a = sheet.addCell('b', {type: 'boolean', val: true});

  t.equal(called, 1);
  t.end();
})
