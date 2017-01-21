import check from 'check-types';

var checks = {};

checks['Cell.symbol'] =
  function(thing) {
    check.assert.assigned(thing, 'Symbol was not provided');
    check.assert.string(thing, 'Symbol must be a string');
    check.assert.match(thing, /^(\D)(\w)*$/, '"' + thing + '" is not a valid symbol');
  };

checks['Cell.name'] =
  function(thing) {
    check.assert.maybe.string(thing, 'cell name must be a string');
  };

checks['Cell.formula'] =
  function(thing) {
    check.assert.maybe.string(thing, 'cell formula must be a string');
  };

checks['Cell.displayFormat'] =
  function(thing) {
    check.assert.maybe.string(thing, 'cell name must be a string');
  };

function checkType(thing, type) {
  checks[type](thing);
}

export default checkType;
