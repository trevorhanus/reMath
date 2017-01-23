import {observable, ObservableMap, action, computed, autorun, reaction} from 'mobx';
import * as regex from './utils/regex';
import {Graph} from './Graph';
import {BaseCell} from './BaseCell';
import * as math from 'mathjs';

export class Formula {
  private _graph: Graph;
  private _parentCell: BaseCell;
  @observable private _tempInvalidFormula: string;
  @observable private _formula: string;

  constructor(parentCell: BaseCell, graph: Graph) {
    this._tempInvalidFormula = null;
    this._formula = '';
    this._parentCell = parentCell;
    this._graph = graph;
    this.reactToErrorInValue();
  }

  @action
  setFormula(formula: string): void {
    this._tempInvalidFormula = null;
    const newFormula = regex.cleanFormula(formula);
    const treeRoot: mathjs.MathNode = this.parseFormula(newFormula);
    if (treeRoot === null) {
      this._tempInvalidFormula = formula;
      return;
    }
    const circularReferences = this.findCircularReferences(treeRoot);
    if (circularReferences.length > 0) {
      this._parentCell._errors.circularReferences(circularReferences, newFormula);
      this._tempInvalidFormula = formula;
      return;
    }
    this._formula = newFormula;
  }

  @computed
  public get formula(): string {
    if (this._tempInvalidFormula !== null) {
      return this._tempInvalidFormula;
    } else {
      const treeRootWithSymbols = this.exprTree.transform(this.transformIdToSymbol.bind(this));
      return '= ' + treeRootWithSymbols.toString();
    }
  }

  @computed
  public get value(): number {
    if (this._formula === '') {
      return 0;
    }
    try {
      return this.exprTree.eval(this.scope);
    } catch (e) {
      return NaN;
    }
  }

  @computed
  private get exprTree(): Node {
    const formula = this._formula;
    const treeRoot = math.parse(formula);
    return treeRoot.transform(this.transformSymbolToId.bind(this));
  }

  @computed
  private get scope(): ({[id: string]: number}) {
    let scope: ({[id: string]: number}) = {};
    this.exprTree.filter((node: mathjs.MathNode) => {
      return node.isSymbolNode;
    }).forEach(node => {
      const id = node.name;
      const cell = this._graph.find(id);
      if (cell) {
        scope[id] = cell.value as number;
      }
    });
    return scope;
  }

  @computed
  public get hasDependencies(): boolean {
    return this.exprTree.filter((node: Node) => {
      return node.isSymbolNode;
    }).length > 0;
  }

  public traverseDependencies(callback: (symbolOrId: string) => void): void {
    this.exprTree.filter(node => {
      return node.isSymbolNode;
    }).forEach(node => {
      callback(node.name);
      const cell = this._graph.find(node.name);
      if (cell) {
        cell.traverseDependecies(callback);
      }
    });
  }

  public dependsOn(symbolOrId: string): boolean {
    if (!this.exprTree) {
      return false;
    }
    let dependsOn = false;
    this.traverseDependencies(dependencySymbolOrId => {
      if (symbolOrId === dependencySymbolOrId) {
        dependsOn = true;
      }
    });
    return dependsOn;
  }

  private parseFormula(formula: string): Node {
    let node: Node = null;
    try {
      node = math.parse(formula);
    } catch (e) {
      this._parentCell._errors.invalidFormula(formula, e);
    }
    return node;
  }

  private findCircularReferences(treeRoot: Node): BaseCell[] {
    return treeRoot.filter((node: Node) => {
      return node.isSymbolNode
    }).reduce((cells: BaseCell[], node: Node) => {
      const cell = this._graph.find(node.name);
      if (node.name === this._parentCell.id || node.name === this._parentCell.symbol) {
        return cells.concat(cell);
      }
      if (cell && cell.dependsOn(this._parentCell.id)) {
        return cells.concat(cell);
      } else {
        return cells;
      }
    }, []);
  }

  private transformSymbolToId(node: Node): mathjs.MathNode {
    if (!node.isSymbolNode) {
      return node;
    }
    const symbol = node.name;
    const newNode: mathjs.MathNode = node.clone();
    const id = this._graph.getId(symbol);
    if (id) {
      newNode.name = id;
    } else {
      // TODO: add a warning to the cell: non-existent reference
    }
    return newNode;
  }

  private transformIdToSymbol(node: mathjs.MathNode): mathjs.MathNode {
    if (!node.isSymbolNode) {
      return node;
    }
    const id = node.name;
    const symbol = this._graph.getSymbol(id);
    if (symbol) {
      const newNode: mathjs.MathNode = node.clone();
      newNode.name = symbol;
      return newNode;
    } else {
      // TODO: add a warning to the cell: non-existent reference
      return node;
    }
  }

  private reactToErrorInValue(): void {
    reaction(
      () => { return this.value; },
      value => { 
        if (isNaN(value as number)) {
          this._parentCell._errors.referenceError();
        }
      },
      { fireImmediately: false }
    );
  }
}

export interface Node extends mathjs.MathNode {}
