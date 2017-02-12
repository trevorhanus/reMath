import * as error from './errors/CellError';
import { Graph } from './Graph';
export declare class BaseCell {
    private _id;
    private _graph;
    private _errors;
    private _symbol;
    private _textValue;
    private _formula;
    private _locked;
    constructor(options: Options, graph: Graph);
    readonly id: string;
    readonly symbol: string;
    readonly formula: string;
    readonly hasDependencies: boolean;
    dependsOn(symbolOrId: string): boolean;
    readonly hasError: boolean;
    readonly errorMessage: string;
    readonly errors: error.CellError[];
    readonly locked: boolean;
    lock(): void;
    unlock(): void;
    updateSymbol(newSymbol: string): void;
    setValue(value: string): void;
    private setFormula(formula);
    readonly value: string | number | boolean;
    traverseDependecies(callback: (symbolOrId: string) => void): void;
    private readonly textValue;
    readonly displayValue: string;
}
export interface Options {
    symbol: string;
    locked?: boolean;
    value?: string;
    displayValue?: string;
}
