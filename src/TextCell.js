import {observable, computed, map} from 'mobx';
import BaseCell from './BaseCell.js';


export default class TextCell extends BaseCell {

  @observable content = '';
  @observable textAlign;

  constructor(symbol, parentSheet, options) {
    super(symbol, parentSheet, options);

    // Assume the parameters have already been validated
    const {content, textAlign} = options || {};

    this.content = content || null;
    this.textAlign = textAlign || 'right';
  }

  /**
  * Public API
  */

  value() {
    try {
      return this.content;
    } catch(e) {
      this._parentSheet._alert({type: 'error', message: 'error evaluating ' + this.symbol});
      return 'error';
    }
  }
}
