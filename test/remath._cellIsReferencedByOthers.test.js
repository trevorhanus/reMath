var test = require('tape-catch');
var Remath = require('..').default;

// remath._cellIsReferencedByOthers
test('Works', (t) => {

  var sheet = new Remath();
  var a = sheet.addCell('a');
  var b = sheet.addCell('b', {type: 'boolean', val: true});
  var c = sheet.addCell('c', {type: 'text', content: 'Testing text cell'});
  var d = sheet.addCell('d');
  a.setFormula('d + 10');

  t.equal(sheet._cellIsReferencedByOthers('d'), true);
  t.equal(sheet._cellIsReferencedByOthers('a'), false);
  t.equal(sheet._cellIsReferencedByOthers('b'), false);
  t.equal(sheet._cellIsReferencedByOthers('c'), false);

  t.end();
});
