import {observable, extendObservable, computed, autorun} from 'mobx';
import _ from 'underscore';
import Cell from './Cell';
import {randomUuid} from './utils';
import check from './check';

export default class Remath {

  @observable cells = [];

  constructor() {
    this.cells = [];
    this._alertCallbacks = [];
  }

  autorun = autorun;

  find(symbol) {
    let cell = _.findWhere(this.cells, {symbol: symbol});
    if (!!cell) {
      return cell;
    } else {
      return null;
    }
  }

  /**
   * Public API
   */

  addCell(symbol, options) {
    // Assume we have no control over what is passed in for the symbol and the options
    const {name, formula, displayFormat} = options || {};

    try {
      check(symbol, 'Cell.symbol');
      check(name, 'Cell.name');
      check(formula, 'Cell.formula');
      check(displayFormat, 'Cell.displayFormat');

      let cell = new Cell(symbol, this, options);
      if (!!cell) {
        this.cells.push(cell);
        return cell;
      } else {
        throw new Error('Error creating a new cell');
      }

    } catch(e) {
      this._alert({type: 'error', message: e.message});
      return null;
    }
  }

  onAlert(callback) {
    // TODO: verify callback is a function
    this._alertCallbacks.push(callback);
  }

  removeAlert(id) {
    this._removeAlert(id);
  }

  /**
   * Private Methods
   */

   _alert(alert) {
     this._alertCallbacks.forEach(callback => {
       callback(alert);
     });
   }

  _symbolDoesExist(symbol) {
    return _.findWhere(this.cells, {symbol: symbol});
  }
}
