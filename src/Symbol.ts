import {observable, computed, action} from 'mobx';
import {isValidSymbol} from './utils/regex';
import {Graph} from './Graph';
import hasher from './utils/Hasher';
import {BaseCell} from './BaseCell';
import * as error from './errors/CellError';

export class Symbol {
  private _parentCell: BaseCell;
  @observable private _symbol: string;
  @observable private _tempInvalidSymbol: string;

  constructor(symbol: string, parentCell: BaseCell) {
    this._parentCell = parentCell;
    this._tempInvalidSymbol = null;
    this.updateSymbol(symbol);
  }

  @computed
  public get symbol(): string {
    if (this._tempInvalidSymbol !== null) {
      return this._tempInvalidSymbol;
    } else {
      return this._symbol || '';
    }
  }

  @action
  updateSymbol(newSymbol: string): void {
    // start fresh
    this._tempInvalidSymbol = null;
    this._parentCell._errors.clear(error.Type.INVALID_SYMBOL);

    newSymbol = newSymbol.trim();

    if (!isValidSymbol(newSymbol)) {
      this._parentCell._errors.invalidSymbol(newSymbol);
      this._tempInvalidSymbol = newSymbol;
      return;
    }
    const oldSymbol = this._symbol;
    if (oldSymbol !== null && oldSymbol !== undefined) {
      hasher.swapKeys(oldSymbol, newSymbol);
    }
    this._symbol = newSymbol;
  }
}