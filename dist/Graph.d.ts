import { BaseCell, Options } from './BaseCell';
import * as messages from './Messages';
export declare class Graph {
    private _cells;
    private _messages;
    private _symbolToIdMap;
    constructor();
    readonly cells: BaseCell[];
    find(symbolOrId: string): BaseCell;
    symbolExists(symbol: string): boolean;
    fromJSON(calcJSON: any): void;
    addCell(options: Options): BaseCell;
    removeCell(symbol: string): void;
    readonly messages: messages.Message[];
    removeMessage(id: string): void;
    private cellIsReferencedByOthers(id);
    getId(symbol: string): string;
    getSymbol(id: string): string;
    private mapSymbol(symbol, id);
    updateSymbolToIdMap(oldSymbol: string, newSymbol: string): void;
}
