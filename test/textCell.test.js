var test = require('tape-catch');
var Remath = require('..').default;
var TextCell = require('../lib/TextCell').default;

test('Can create a text cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'text', content: 'Testing text cell'});

  t.equal(a.value(), 'Testing text cell');
  t.end();

});

test('Adds text cell to sheet', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'text', content: 'Testing text cell'});

  t.equal(sheet.find('a'), a);
  t.end();
});

test('Text cell\'s content is reactive', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'text', content: 'Testing text cell'});

  var hasRun = 0;
  sheet.autorun(function () {
    a.value();
    hasRun++;
  });

  a.content = 'new content';

  t.equal(hasRun, 2);
  t.end();
});

test('Can get the value for a text cell', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'text', content: 'Testing text cell'});

  a.content = 'new content';

  t.equal(a.value(), 'new content');
  t.end();
});

test('Copies textAlign when added', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'text', content: 'Testing text cell', textAlign: 'center'});

  a.content = 'new content';

  t.equal(a.textAlign, 'center');
  t.end();
});

test('Defaults textAlign to right', (t) => {
  var sheet = new Remath();
  var a = sheet.addCell('a', {type: 'text', content: 'Testing text cell'});

  a.content = 'new content';

  t.equal(a.textAlign, 'right');
  t.end();
});
