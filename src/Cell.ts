import {observable, ObservableMap, asMap, computed, autorun, action} from 'mobx';
import * as math from 'mathjs';
import {CellError, ErrorJSON, CellErrorType} from './CellError';
import {getValueType, cleanFormula} from './utils/regex';
import {uniq as _uniq} from 'underscore';
import Remath from './';
import {v4} from 'uuid';

export class Cell {
  private _id: string;
  private _graph: Remath;
  @observable protected _error: CellError;
  @observable private _symbol: string;
  @observable private _value: string;
  @observable private _formula: string;
  @observable protected _locked: boolean;
  @observable private _errorMessage: string;
  @observable customProps: ObservableMap<string>;

  constructor(options: Options, graph: Remath) {
    this._id = v4();
    this._graph = graph;
    this._error = new CellError();
    this.setSymbol(options.symbol);
    this.setValue(options.value);
    this._locked = options.locked !== undefined ? options.locked : false;
    this.customProps = observable.map<string>();
    autorun(this.watchForErrorInValue.bind(this));
  }

  @computed
  get id(): string {
    return this._id;
  }

  @computed
  get symbol(): string {
    return this._symbol;
  }

  @computed
  get locked(): boolean {
    return this._locked;
  }

  @action
  setSymbol(symbol: string): void {
    this.validateSymbol(symbol);
    this._symbol = symbol;
  }

  @action
  public setValue(value: string) {
    if (this.locked) {
      return;
    }

    value = value === undefined ? '' : value;

    const valueType = getValueType(value);
    if (valueType === 'formula') {
      this._value = null;
      this.setFormula(value);
    } else if (valueType === 'text') {
      this._formula = null;
      this._value = value;
    }
  }

  @computed
  public get value(): string | number | boolean {
    if (this._value !== null) {
      return this._value;
    } else {
      const formula = this._formula;
      if (formula === '') {
        return 0;
      }
      const scope = this.scope;
      try {
        return math.eval(formula, scope);
      } catch (e) {
        return NaN;
      }
    }
  }

  @computed
  public get displayValue(): string {
    if (this.hasError) {
      return this._error.displayValue;
    } else {
      return this.value.toString();
    }
  }

  @action
  private setFormula(value: string) {
    let formula = cleanFormula(value);

    const newReferencedSymbols = math.parse(formula).filter(node => {
      return node.isSymbolNode;
    }).map(node => { 
      return node.name; 
    });

    this._formula = formula;
  }

  @action
  lock(): void {
    this._locked = true;
  }

  @action
  unlock(): void {
    this._locked = false;
  }

  @computed 
  get error(): CellError {
    return this._error;
  }

  @computed
  get hasError(): boolean {
    return this._error.type !== null;
  }

  @computed
  get hasDependents(): boolean {
    return this.symbolNodes.length > 0;
  }

  dependsOn(symbol: string): boolean {
    if (this.symbol === symbol) {
      return true;
    }
    return this.symbolNodes.some(node => {
      // if this node's symbol equals, then it depends on it
      if (symbol === node.name) {
        return true;
      }
      // else we need to check the next level of references
      const referencedCell = this._graph.find(node.name);
      if (referencedCell) {
        return referencedCell.dependsOn(symbol);
      } else {
        return false;
      }
    });
  }

  @computed
  private get scope() {
    let s: any = {};
    this.referencedCells.forEach(cell => {
      s[cell.symbol] = cell.value;
    });
    return s;
  }

  @computed
  private get referencedCells(): Cell[] {
    let cells: Cell[] = [];
    this.symbolNodes.forEach(node => {
      const cell = this._graph.find(node.name);
      if (cell) {
        cells.push(cell);
      }
    });
    return cells;
  }

  @computed
  private get symbolNodes(): mathjs.MathNode[] {
    const symbolNodes = this.nodeTreeRoot.filter(node => {
      return node.isSymbolNode;
    });

    return _uniq(symbolNodes, false, node => {
      return node.name;
    });
  }

  @computed
  private get nodeTreeRoot(): mathjs.MathNode {
    const formula = this._formula;
    return math.parse(formula);
  }

  private watchForErrorInValue(): void {
    if (isNaN(this.value)) {
      this._error.set({
        type: CellErrorType.REF_NOT_FOUND,
        message: 'Error in one of the references'
      });
    }
  }

  private validateSymbol(symbol: string): void {
    const regex = /^(\D)(\w)*$/;
    if (!regex.test(symbol)) {
      this._error.set({
        type: CellErrorType.INVALID_SYMBOL,
        message: `Symbol: \`${symbol}\` is not a valid symbol. Symbols can only include alphanumeric characters including the underscore.`
      });
    } else {
      this._error.clear();
    }
  }
}

export interface Options {
  symbol: string;
  locked?: boolean;
  value?: string;
  displayValue?: string;
}
