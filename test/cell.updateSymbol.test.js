// Need the ability to update a cells symbol

var test = require('tape-catch');
var Remath = require('..').default;

/**
 * Remath.addCell Method
 */

test('Can update a cells symbol', (t) => {

  var sheet = new Remath();

  var gamma = sheet.addCell('gamma');

  gamma.updateSymbol('alpha');

  t.equal(gamma.symbol, 'alpha');

  t.end();
});
