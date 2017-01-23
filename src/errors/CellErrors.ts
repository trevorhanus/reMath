import {observable, ObservableMap, computed, action} from 'mobx';
import {BaseCell} from '../BaseCell';
import * as error from './CellError';

export class CellErrors {
  @observable private _errors: ObservableMap<error.CellError>;

  constructor() {
    this._errors = observable.map<error.CellError>();
  }

  @computed
  public get hasError(): boolean {
    return this._errors.size > 0;
  }

  @computed
  public get errors(): error.CellError[] {
    return this._errors.values();
  }

  @computed
  public get displayValue(): string {
    if (this.hasError) {
      return this._errors.values()[0].displayValue;
    } else {
      return '';
    }
  }

  @computed
  public get message(): string {
    if (this.hasError) {
      return this._errors.values()[0].message;
    } else {
      return null;
    }
  }

  @action
  public referenceError(): void {
    const options = {
      type: error.Type.REF_NOT_FOUND,
      message: `there is an error in one of the references`
    }
    this.set(options);
  }

  @action
  public invalidFormula(formula: string, e: Error): void {
    const options = {
      type: error.Type.INVALID_FORMULA,
      message: `Formula '${formula}' is invalid. ${e.message}`
    };
    this.set(options);
  }

  @action
  public invalidSymbol(symbol: string): void {
    const options = {
      type: error.Type.INVALID_SYMBOL,
      message: `[${symbol}] is an invalid symbol`
    };
    this.set(options);
  }

  @action
  public unexpectedValue(value: string): void {
    const options = {
      type: error.Type.INVALID_VALUE,
      message: `Value '${value}' causes an error.`
    };
    this.set(options);
  }

  @action
  public circularReferences(cells: BaseCell[], formula: string) {
    const cellSymbols = cells.map(cell => {
      return cell.symbol;
    }).join(', ');
    const options = {
      type: error.Type.REF_CIRCULAR,
      message: `'${formula}' creates circular references because ${cellSymbols} references this cell`
    }
    this.set(options);
  }

  @action
  set(options: error.Options) {
    const err = new error.CellError(options);
    this._errors.set(err.type, err);
  }

  @action
  clear(type: error.Type): void {
    this._errors.delete(type.toString());
  }
}
