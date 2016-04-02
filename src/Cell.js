import {observable, computed} from 'mobx';
import {randomUuid} from './utils';
import math from 'mathjs';
import numeral from 'numeral';
import {getFormatString} from './utils';
import check from './check';

export default class Cell {

  id;
  symbol;
  name;
  _parentCalc;
  _dependents = {};
  @observable displayFormat = '0,0';
  @observable x = 0;
  @observable y = 0;
  @observable formula = '';
  @computed get value() {
    const value = math.eval(this.formula, this._scope());
    return value;
  }

  // A new cell should only ever be instantiated through the Remath.addCell method
  // Instantiating a cell directly, will not register the cell on the parent sheet
  constructor(symbol, parentSheet, options) {
    // Throw an error if there is no parentSheet, this means that the Remath.addCell method was not used
    if (!parentSheet) throw new Error('Could not create cell. Use the Remath.addCell method');

    // Assume the parameters have already been validated
    const {name, formula, displayFormat} = options || {};

    this.id = randomUuid();
    this.symbol = symbol;
    this.name = name || null;
    this._parentSheet = parentSheet;
    this.displayFormat = displayFormat || '0,0';
    this._dependents = {};
    if (!!formula) this.setFormula(formula);
  }

  /**
   * Public API
   */

  displayValue() {
    try {
      if (isNaN(this.value)) {
        return 'error';
      } else {
        return numeral(this.value).format(this._displayFormat());
      }
    } catch(e) {
      this._parentSheet._alert({type: 'error', message: e.message});
    }
  }

  isDependent() {
    return Object.keys(this._dependents).length > 0;
  }

  setFormula(newFormula) {
    const self = this;

    try {
      // Verify formula is of valid type
      check(newFormula, 'Cell.formula')

      // First we need to parse the formula into a nodeTree
      var nodeTree = math.parse(newFormula);

      // Find all the symbolNodes
      var symbols = {};
      var symbolNodes = nodeTree.filter(function (node) {
        if (node.isSymbolNode && !symbols[node.name]) {
          symbols[node.name] = true;
          return true;
        }
      });

      // Remove all previous dependents
      this._removeAllDependents();

      // Add a dependency for each of the symbolNodes
      symbolNodes.forEach(function (node) {
        let symbol = node.name;
        self._addDependency(symbol);
      });

      // Set the new formula
      this.formula = newFormula;

    } catch(e) {
      self._parentSheet._alert({type: 'error', message: e.message});
    }
  }

  /**
   * Private Methods
   */

  _displayFormat() {
    return getFormatString(this.displayFormat);
  }

  _removeAllDependents() {
    this._dependents = {};
  }

  _addDependency(symbol) {
    // first make sure the symbol exists in the parentSheet
    if (this._parentSheet._symbolDoesExist(symbol)) {
      // Make sure the cell is not already dependent on the symbol
      if (!this._dependents[symbol]) {
        const dep = this._parentSheet.find(symbol);
        this._dependents[symbol] = dep;
      } else {
        throw new Error('Cell is already dependent on ' + symbol);
      }
    } else {
      throw new Error('Could not find symbol: ' + symbol);
    }
  }

  _scope() {
    var scope = {};
    for (const symbol in this._dependents) {
      const dep = this._dependents[symbol];
      scope[symbol] = dep.value;
    }
    return scope;
  }
}
