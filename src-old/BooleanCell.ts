import {observable, computed, map} from 'mobx';
import BaseCell from './BaseCell.js';

export default class BooleanCell extends BaseCell {

  @observable val;

  constructor(symbol, parentSheet, options) {
    super(symbol, parentSheet, options);

    // Assume the parameters have already been validated
    const {val} = options || {};

    this.val = val;
  }

  /**
  * Public API
  */

  value() {
    return this.val;
  }
}
