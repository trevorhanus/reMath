import { BaseCell } from '../BaseCell';
import * as error from './CellError';
export declare class CellErrors {
    private _errors;
    constructor();
    readonly hasError: boolean;
    readonly errors: error.CellError[];
    readonly displayValue: string;
    readonly message: string;
    referenceError(): void;
    invalidFormula(formula: string, e: Error): void;
    invalidSymbol(symbol: string): void;
    unexpectedValue(value: string): void;
    circularReferences(cells: BaseCell[], formula: string): void;
    set(options: error.Options): void;
    clear(type: error.Type): void;
}
