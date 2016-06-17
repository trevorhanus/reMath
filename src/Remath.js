import {observable, autorun} from 'mobx';
import _ from 'underscore';
import Cell from './Cell';
import TextCell from './TextCell';
import BooleanCell from './BooleanCell';
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
    if (!symbol) throw new Error('must pass a symbol to find');

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

    const {type} = options || {};

    if (type === 'text') {
      return this._addTextCell(symbol, options);
    }

    if (type === 'boolean') {
      return this._addBooleanCell(symbol, options);
    }

    const {name, formula, displayFormat} = options || {};
    // If no type is given, default to a formula cell
    try {
      check(symbol, 'Cell.symbol');
      check(name, 'Cell.name');
      check(formula, 'Cell.formula');
      check(displayFormat, 'Cell.displayFormat');

      // Make sure symbol does not exists
      if (this._symbolDoesExist(symbol)) {
        throw new Error(symbol + 'already exists');
      };

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

  /**
   * Removes a cell from the sheet
   *
   */
  removeCell(symbol) {
    // Make sure the symbol exists
    // If not, this is most likely a developer error, so throw an uncaught error
    if (!this._symbolDoesExist(symbol)) {
      throw new Error(symbol + 'does not exist');
    }

    // Find out if there are other cells that depend on the value of this cell
    // If so, emit a warning, because these cells will now have undefined values
    if (this._cellIsReferencedByOthers(symbol)) {
      this._alert({type: 'warning', message: 'there are other cells the depend on ' + symbol + '. Deleting it will cause errors.'});
    }

    // Now we need to find all cells that depend on this cell, and delete their references
    _.forEach(this.cells, (cell) => {
      if (cell._dependsOn(symbol)) {
        cell._removeDependent(symbol);
      }
    });

    // Remove the cell from the cells collection
    const index = this._indexOfSymbol(symbol);
    this.cells.splice(index, 1);
  }

  onAlert(callback) {
    // TODO: verify callback is a function
    this._alertCallbacks.push(callback);
  }

  /**
   * Private Methods
   */

   _addBooleanCell(symbol, options) {
     // Assume we have no control over what is passed in for the symbol and the options
     const {val} = options || {};

     try {
       check(symbol, 'Cell.symbol');

       // Make sure symbol does not exists
       if (this._symbolDoesExist(symbol)) {
         throw new Error(symbol + 'already exists');
       };

       let cell = new BooleanCell(symbol, this, options);
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

   _addTextCell(symbol, options) {
     // Assume we have no control over what is passed in for the symbol and the options
     const {name, content} = options || {};

     try {
       check(symbol, 'Cell.symbol');
       check(name, 'Cell.name');

       // Make sure symbol does not exists
       if (this._symbolDoesExist(symbol)) {
         throw new Error(symbol + 'already exists');
       };

       let cell = new TextCell(symbol, this, options);
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

   _alert(alert) {
     this._alertCallbacks.forEach(callback => {
       callback(alert);
     });
   }

   _cellIsReferencedByOthers(symbol) {
     return _.reduce(this.cells, (isReferenced, cell) => {
       return cell._dependsOn(symbol);
     }, false);
   }

   _indexOfSymbol(symbol) {
     return _.findIndex(this.cells, (cell) => {
       return cell.symbol === symbol;
     });
   }

  _symbolDoesExist(symbol) {
    return _.findWhere(this.cells, {symbol: symbol});
  }
}
