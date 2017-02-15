import {observable, ObservableMap, action, computed, autorun, reaction} from 'mobx';
import * as regex from './utils/regex';
import {Graph} from './Graph';
import {BaseCell} from './BaseCell';
import {Type} from './errors/CellError';
import * as math from 'mathjs';
import {matchesIdFormat} from './utils/regex';
import hasher from './utils/Hasher';

export interface Node extends mathjs.MathNode {
  hash: string;
}

export class Formula {
  private _graph: Graph;
  private _parentCell: BaseCell;
  @observable private _tempInvalidFormula: string;
  @observable private _formula: string;
  @observable.ref private _rootNode: Node;

  constructor(parentCell: BaseCell, graph: Graph) {
    this._tempInvalidFormula = null;
    this._formula = '';
    this._parentCell = parentCell;
    this._graph = graph;
    this._rootNode = null;
    this.reactToErrorInValue();
  }

  @action
  setFormula(formula: string): void {
    this._tempInvalidFormula = null;
    const newFormula = regex.cleanFormula(formula);
    // make sure the formula is valid
    const treeRoot: Node = this.parseFormula(newFormula);
    if (treeRoot === null) {
      this._tempInvalidFormula = formula;
      return;
    }
    // check for circular references
    const circularReferences = this.findCircularReferences(treeRoot);
    if (circularReferences.length > 0) {
      this._parentCell._errors.circularReferences(circularReferences, newFormula);
      this._tempInvalidFormula = formula;
      return;
    }
    // set the hash for any symbol nodes
    this.assignSymbolHashesToSymbolNodes(treeRoot);
    this._rootNode = treeRoot as Node;
    this._formula = newFormula;
  }

  @computed
  public get formula(): string {
    if (this._tempInvalidFormula !== null) {
      return this._tempInvalidFormula;
    } else {
      this._rootNode.forEach(updateSymbols);
      return `= ${this._rootNode.toString()}`;
    }

    function updateSymbols(node: Node): void {
      if (node.isSymbolNode) {
        node.name = hasher.getKey(node.hash);
      }
    }
  }

  @computed
  public get value(): number {
    if (this._formula === '') {
      return 0;
    }
    try {
      return this._rootNode.eval(this.scope);
    } catch (e) {
      return NaN;
    }
  }

  @computed
  private get scope(): ({[symbol: string]: number}) {
    let scope: ({[symbol: string]: number}) = {};
    this.symbolNodes.forEach((node: Node) => {
      const symbol = node.name;
      const cell = this._graph.find(symbol);
      if (cell) {
        scope[symbol] = cell.value as number;
      }
    });
    return scope;
  }

  @computed
  private get symbolNodes(): Node[] {
    return this._rootNode.filter((node: Node) => {
      return node.isSymbolNode;
    }) as Node[];
  }

  @computed
  public get hasDependencies(): boolean {
    return this._rootNode.filter((node: Node) => {
      return node.isSymbolNode;
    }).length > 0;
  }

  private assignSymbolHashesToSymbolNodes(root: Node): void {
    root.filter(node => {
      return node.isSymbolNode;
    }).forEach((node: Node) => {
      const symbol = node.name;
      const hash = hasher.getHash(symbol);
      node.hash = hash;
    });
  }

  public traverseDependencies(callback: (symbolOrId: string) => void): void {
    this.symbolNodes.forEach(node => {
      callback(node.name);
      const cell = this._graph.find(node.name);
      if (cell) {
        cell.traverseDependecies(callback);
      }
    });
  }

  public dependsOn(symbolOrHash: string): boolean {
    if (!this._rootNode) return false;
    const isHash = matchesIdFormat(symbolOrHash);
    const symbol = isHash ? hasher.getKey(symbolOrHash) : symbolOrHash;

    let dependsOn = false;
    this.traverseDependencies(dependencySymbolOrHash => {
      const isHash = matchesIdFormat(dependencySymbolOrHash);
      const depSymbol = isHash ? hasher.getKey(dependencySymbolOrHash): dependencySymbolOrHash;
      if (symbol === depSymbol) {
        dependsOn = true;
      }
    });
    return dependsOn;
  }

  private parseFormula(formula: string): Node {
    let node: Node = null;
    try {
      node = math.parse(formula) as Node;
    } catch (e) {
      this._parentCell._errors.invalidFormula(formula, e);
    }
    return node;
  }

  private findCircularReferences(treeRoot: Node): BaseCell[] {
    let refs: BaseCell[] = [];
    treeRoot.filter((node: Node) => {
      return node.isSymbolNode
    }).forEach((node: Node) => {
      const cell = this._graph.find(node.name);
      if (node.name === this._parentCell.hash || node.name === this._parentCell.symbol) {
        if (cell !== null) {
          refs.push(cell);
        }
      }
      if (cell !== null && cell.dependsOn(this._parentCell.hash)) {
        refs.push(cell);
      }
    });
    return refs;
  }

  // private transformSymbolToHash(node: mathjs.MathNode): mathjs.MathNode {
  //   if (!node.isSymbolNode) {
  //     return node;
  //   }
  //   const symbol = node.name;
  //   const hash = hasher.getHash(symbol);
  //   const newNode: mathjs.MathNode = node.clone();
  //   newNode.name = hash;
  //   return newNode;
  // }

  // private transformHashToSymbol(node: mathjs.MathNode): mathjs.MathNode {
  //   if (!node.isSymbolNode) {
  //     return node;
  //   }
  //   const hash = node.name;
  //   const symbol = hasher.getKey(hash);
  //   if (symbol) {
  //     const newNode: mathjs.MathNode = node.clone();
  //     newNode.name = symbol;
  //     return newNode;
  //   } else {
  //     // TODO: add a warning to the cell: non-existent reference
  //     return node;
  //   }
  // }

  private reactToErrorInValue(): void {
    reaction(
      () => this.value,
      value => {
        if (isNaN(value as number)) {
          this._parentCell._errors.referenceError();
        } else {
          this._parentCell._errors.clear(Type.REF_NOT_FOUND);
        }
      },
      { fireImmediately: true }
    );
  }
}
