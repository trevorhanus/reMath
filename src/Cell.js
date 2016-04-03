import {observable, computed, map} from 'mobx';
import {randomUuid} from './utils';
import math from 'mathjs';
import _ from 'underscore';
import numeral from 'numeral';
import {getFormatString} from './utils';
import check from './check';

export default class Cell {

  id;
  symbol;
  name;
  _parentCalc;

  @observable displayFormat = '0,0';
  @observable _dependents = map();
  @observable formula = '';

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
    this._dependents = map();
    this._parentSheet = parentSheet;
    this.displayFormat = displayFormat || '0,0';
    if (!!formula) this.setFormula(formula);
  }

  /**
  * Public API
  */

  value() {
    try {
      const value = math.eval(this.formula, this._scope());
      return value;
    } catch(e) {
      this._parentSheet._alert({type: 'error', message: 'error evaluating ' + this.symbol});
      return 'error';
    }
  }

  displayValue() {
    try {
      if (isNaN(this.value())) {
        return 'error';
      } else {
        return numeral(this.value()).format(this._displayFormat());
      }
    } catch(e) {
      this._parentSheet._alert({type: 'error', message: e.message});
    }
  }

  isDependent() {
    return this._dependents.size > 0;
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

  updateSymbol(newSymbol) {
    try {

      check(newSymbol, 'Cell.symbol');

      // hold a reference to the old symbol
      const oldSymbol = this.symbol;

      // Update the symbol
      this.symbol = newSymbol;

      // Find all cells that reference this cell and update their formulas
      // this will then trigger an update and will update their dependencies
      this._parentSheet.cells.forEach(cell => {
        if (cell._dependsOn(oldSymbol)) {
          // Find the oldSymbol in the formula and replace it with the newSymbol
          let oldFormula = cell.formula;
          let newFormula = oldFormula.replace(oldSymbol, newSymbol);
          cell.setFormula(newFormula);
        }
      });
    } catch(e) {
      this._parentSheet._alert({type: 'error', message: e.message});
    }
  }

  /**
   * Private Methods
   */

  _displayFormat() {
    return getFormatString(this.displayFormat);
  }

  // Returns a bool if this cell depends on symbol
  _dependsOn(symbol) {
    return this._dependents.has(symbol);
  }

  _removeDependent(symbol) {
    this._dependents.delete(symbol);
  }

  _removeAllDependents() {
    this._dependents.clear();
  }

  _addDependency(symbol) {
    // first make sure the symbol exists in the parentSheet
    if (this._parentSheet._symbolDoesExist(symbol)) {
      const dep = this._parentSheet.find(symbol);
      this._dependents.set(symbol, dep);
    } else {
      throw new Error('Could not find symbol: ' + symbol);
    }
  }

  _scope() {
    var scope = {};
    this._dependents.forEach((dep, symbol) => {
      scope[symbol] = dep.value();
    });
    return scope;
  }
}
