import { Graph } from './Graph';
import { BaseCell } from './BaseCell';
export declare class Formula {
    private _graph;
    private _parentCell;
    private _tempInvalidFormula;
    private _formula;
    constructor(parentCell: BaseCell, graph: Graph);
    setFormula(formula: string): void;
    readonly formula: string;
    readonly value: number;
    private readonly exprTree;
    private readonly scope;
    readonly hasDependencies: boolean;
    traverseDependencies(callback: (symbolOrId: string) => void): void;
    dependsOn(symbolOrId: string): boolean;
    private parseFormula(formula);
    private findCircularReferences(treeRoot);
    private transformSymbolToId(node);
    private transformIdToSymbol(node);
    private reactToErrorInValue();
}
export interface Node extends mathjs.MathNode {
}
