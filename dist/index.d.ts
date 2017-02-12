import { BaseCell } from './BaseCell';
import { Message } from './Messages';
declare class Remath {
    private _graph;
    constructor();
    find(symbolOrId: string): BaseCell;
    readonly cells: BaseCell[];
    symbolExists(symbol: string): boolean;
    addCell(options: any): BaseCell;
    removeCell(symbol: string): void;
    readonly messages: Message[];
    removeMessage(id: string): void;
    fromJSON(calcJSON: any): void;
}
export { BaseCell as Cell, Remath };
