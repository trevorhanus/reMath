import {observable, ObservableMap, action, computed, autorun} from 'mobx';
import * as math from 'mathjs';
import {uniq as _uniq, difference as _difference} from 'underscore';
import {Cell, CellJSON} from './Cell';
import {BaseCell} from './BaseCell';
import Remath from './';

export class FormulaCell extends BaseCell implements Cell {
  @observable private _formula: string;
  private _cells: Remath;
  @observable private _displayFormat: string;

  constructor(options: CellJSON, cells: Remath) {
    super(options);
    this._type = 'formula';
    this._formula = (options.value as string) || '';
    this._cells = cells;
    autorun(this.watchForErrors.bind(this));
  }

  @action
  setValue(formula: string): void {
    if (this.locked) {
      return;
    }

    const newReferencedSymbols = math.parse(formula).filter(node => {
      return node.isSymbolNode;
    }).map(node => { 
      return node.name; 
    });

    const circularReference = this.createsCircularReference(newReferencedSymbols);
    
    if (circularReference) {
      this._error.set({
        type: 'error',
        message: `'${formula}' creates a circular reference`
      });
      return;
    }

    this._formula = formula;
  }

  private createsCircularReference(symbols: string[]): boolean {
    const currentCellSymbol = this.symbol;
    return symbols.some(symbol => {
      const referencedCell = this._cells.find(symbol);
      if (referencedCell) {
        return referencedCell.dependsOn(currentCellSymbol);
      } else {
        return false;
      }
    });
  }

  @computed
  get value(): number {
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

  watchForErrors(): void {
    if (isNaN(this.value)) {
      this._error.set({
        type: 'REF_ERROR',
        message: 'Error in one of the references'
      });
    }
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
      const referencedCell = this._cells.find(node.name);
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
      const cell = this._cells.find(node.name);
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
}

export function 