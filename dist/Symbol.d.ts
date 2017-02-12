import { BaseCell } from './BaseCell';
export declare class Symbol {
    private _parentCell;
    private _symbol;
    private _tempInvalidSymbol;
    constructor(symbol: string, parentCell: BaseCell);
    readonly symbol: string;
    updateSymbol(newSymbol: string): void;
}
