var test = require('tape-catch');
var Remath = require('..').default;

/**
 * Remath.find Method
 */

test('Returns null when looking for an input that does not exist', (t) => {

  var sheet = new Remath();

  t.equal(sheet.find('a'), null);

  t.end();
});

test('Throws when no param is passed', (t) => {

  var sheet = new Remath();

  t.throws(() => { sheet.find() });

  t.end();
});

test('Throws when empty string is passed', (t) => {

  var sheet = new Remath();

  t.throws(() => sheet.find(''));

  t.end();
});

test('Returns an Input that exists', (t) => {

  var sheet = new Remath();

  var a = sheet.addCell('a');

  t.deepEqual(sheet.find('a'), a);

  t.end();
});
