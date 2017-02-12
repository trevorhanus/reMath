import {observable, computed, autorun, action} from 'mobx';
import * as errors from './errors/CellErrors';
import * as error from './errors/CellError';
import {getValueType} from './utils/regex';
import hasher from './utils/Hasher';
import {Formula} from './Formula';
import {Symbol} from './Symbol';
import {Graph} from './Graph';

export class BaseCell {
  private _hash: string;
  private _graph: Graph;
  private _errors: errors.CellErrors;
  private _symbol: Symbol;
  @observable private _textValue: string;
  @observable private _formula: Formula;
  @observable private _locked: boolean;

  constructor(options: Options, graph: Graph) {
    const {symbol} = options;
    this._hash = hasher.getHash(symbol);
    this._graph = graph;
    this._errors = new errors.CellErrors();
    this._symbol = new Symbol(options.symbol, this);
    this._formula = new Formula(this, graph);
    this.setValue(options.value);
    this._locked = options.locked !== undefined ? options.locked : false;
  }

  @computed
  get hash(): string {
    return this._hash;
  }

  @computed
  get symbol(): string {
    return this._symbol.symbol;
  }

  @computed
  public get formula(): string {
    return this._formula.formula;
  }

  @computed
  public get hasDependencies(): boolean {
    return this._formula.hasDependencies;
  }

  public dependsOn(symbolOrHash: string): boolean {
    return this._formula.dependsOn(symbolOrHash);
  }

  @computed
  get hasError(): boolean {
    return this._errors.hasError;
  }

  @computed
  public get errorMessage(): string {
    return this._errors.message;
  }

  @computed
  public get errors(): error.CellError[] {
    return this._errors.errors;
  }

  @computed
  get locked(): boolean {
    return this._locked;
  }

  @action
  lock(): void {
    this._locked = true;
  }

  @action
  unlock(): void {
    this._locked = false;
  }

  @action
  updateSymbol(newSymbol: string): void {
    if (this.locked) {
      return;
    }
    this._symbol.updateSymbol(newSymbol);
  }

  @action
  public setValue(value: string) {
    if (this.locked) {
      return;
    }
    value = value === undefined ? '' : value;
    const valueType = getValueType(value);
    if (valueType === 'formula') {
      this._textValue = null;
      this._formula.setFormula(value);
    } else if (valueType === 'text') {
      this._textValue = value;
    } else {
      this._errors.unexpectedValue(value);
    }
  }

  @action
  private setFormula(formula: string) {
    this._formula.setFormula(formula);
  }

  @computed
  public get value(): string | number | boolean {
    if (this._textValue !== null) {
      return this.textValue;
    } else {
      return this._formula.value;
    }
  }

  public traverseDependecies(callback: (symbolOrId: string) => void): void {
    this._formula.traverseDependencies(callback);
  }

  @computed
  private get textValue(): string {
    if (this.hasError) {
      return this._errors.message;
    } else {
      return this._textValue;
    }
  }

  @computed
  public get displayValue(): string {
    const value = this.value.toString(); // always get value so we react when it changes
    if (this.hasError) {
      return this._errors.displayValue;
    } else {
      return value;
    }
  }
}

export interface Options {
  symbol: string;
  locked?: boolean;
  value?: string;
  displayValue?: string;
}
