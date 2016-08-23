import {observable, computed, map} from 'mobx';
import {randomUuid} from './utils';
import _ from 'underscore';
import check from './check';

export default class BaseCell {

  id;
  name;
  type;
  _parentSheet;

  @observable symbol;
  @observable locked = false;
  // Gravity payments calculator specific properties
  @observable SFFieldName;
  // Custom props. allows user to set any reactive property to the cell
  @observable customProps = map();

  // A new cell should only ever be instantiated through the Remath.addCell method
  // Instantiating a cell directly, will not register the cell on the parent sheet
  constructor(symbol, parentSheet, options) {
    // Throw an error if there is no parentSheet, this means that the Remath.addCell method was not used
    if (!parentSheet) throw new Error('Could not create cell. Use the Remath.addCell method');

    // Assume the parameters have already been validated
    const {name, formula, displayFormat, type, locked, SFFieldName} = options || {};

    this.id = randomUuid();
    this.symbol = symbol;
    this.name = name || null;
    this.type = type || null;
    this.SFFieldName = SFFieldName;
    this.customProps = map();
    this.locked = locked || false;
    this._parentSheet = parentSheet;
  }

  updateSymbol(newSymbol) {
    try {

      check(newSymbol, 'Cell.symbol');

      // hold a reference to the old symbol
      const oldSymbol = this.symbol;

      // Update the symbol
      this.symbol = newSymbol;

    } catch(e) {
      this._parentSheet._alert({type: 'error', message: e.message});
    }
  }
}
